<?php
// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageRead;
use App\Models\MessageReaction;
use App\Models\Relation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Events\MessageSent;
use App\Events\MessageDeleted;
use App\Events\MessageReacted;

class ChatController extends Controller
{
    /**
     * Render chat page (Inertia)
     */
    public function index(Request $request, $relationId = null)
    {
        /** @var User $user */
        $user = Auth::user();

        $relations = $user->relations()
            ->withPivot('is_owner', 'join_at')
            ->with(['lastMessage' => function ($query) {
                $query->latest();
            }])
            ->get()
            ->map(function ($relation) use ($user) {
                return [
                    'id' => $relation->id,
                    'kode' => $relation->kode,
                    'nama' => $relation->nama,
                    'unread_count' => MessageRead::getUnreadCount($relation->id, $user->id),
                    'last_message_at' => $relation->lastMessage?->created_at,
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();

        $currentRelation = null;
        $initialMessages = null;

        if ($relationId) {
            $currentRelation = Relation::findOrFail($relationId);

            if (!$user->hasJoinedRelation($relationId)) {
                abort(403, 'Anda bukan anggota grup ini');
            }

            $initialMessages = Message::forRelation($relationId)
                ->with([
                    'user:id,name,email',
                    'replyTo.user:id,name',
                    'reactions.user:id,name',
                ])
                ->oldestFirst()
                ->paginate(50);
        }

        return Inertia::render('RoomChatPage', [
            'relations' => $relations,
            'currentRelation' => $currentRelation,
            'initialMessages' => $initialMessages,
        ]);
    }

    /**
     * Get messages untuk relation tertentu (dengan pagination)
     */
    public function getMessages(Request $request, $relationId)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($relationId)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        $messages = Message::forRelation($relationId)
            ->with([
                'user:id,name,email',
                'replyTo.user:id,name',
                'reactions.user:id,name',
            ])
            ->oldestFirst()
            ->paginate(50);

        // Mark messages as read
        $unreadMessageIds = $messages->pluck('id')->toArray();
        MessageRead::markMultipleAsRead($unreadMessageIds, $user);

        return response()->json([
            'success' => true,
            'messages' => $messages,
            'unread_count' => MessageRead::getUnreadCount($relationId, $user->id),
        ]);
    }

    /**
     * Kirim pesan baru
     */
    public function sendMessage(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'relation_id' => 'required|exists:relations,id',
            'message' => 'required_without:file|string|max:5000',
            'file' => 'nullable|file|max:20480|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,zip,rar,txt',
            'reply_to_message_id' => 'nullable|exists:messages,id',
        ]);

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($request->relation_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        DB::beginTransaction();
        try {
            $data = [
                'relation_id' => $request->relation_id,
                'user_id' => $user->id,
                'message' => $request->message ?? '',
                'type' => Message::TYPE_TEXT,
                'reply_to_message_id' => $request->reply_to_message_id,
            ];

            // Handle file upload
            if ($request->hasFile('file')) {
                $fileData = Message::storeFile(
                    $request->file('file'),
                    $request->relation_id
                );

                $data['file_path'] = $fileData['path'];
                $data['file_name'] = $fileData['original_name'];
                $data['file_size'] = $fileData['size'];

                // Tentukan type berdasarkan mime type
                if (str_starts_with($fileData['mime_type'], 'image/')) {
                    $data['type'] = Message::TYPE_IMAGE;
                } else {
                    $data['type'] = Message::TYPE_FILE;
                }
            }

            $message = Message::create($data);

            // Load relations
            $message->load(['user:id,name,email', 'replyTo.user:id,name']);

            // Update last_message_at pada relation
            Relation::where('id', $request->relation_id)
                ->update([
                    'last_message_at' => $message->created_at,
                    'updated_at' => now()
                ]);

            DB::commit();

            // Broadcast event ke channel grup
            try {
                broadcast(new MessageSent($message))->toOthers();
            } catch (\Throwable $broadcastException) {
                \Log::warning('Broadcast MessageSent failed: ' . $broadcastException->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => $message,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim pesan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete message (soft delete)
     */
    public function deleteMessage(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah pemilik pesan atau owner relation
        if ($message->user_id !== $user->id) {
            if (!$user->isOwnerOf($message->relation_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }
        }

        $message->delete();

        // Broadcast event ke channel grup
        try {
            broadcast(new MessageDeleted($message->id, $message->relation_id))->toOthers();
        } catch (\Throwable $broadcastException) {
            \Log::warning('Broadcast MessageDeleted failed: ' . $broadcastException->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus',
        ]);
    }

    /**
     * Get list relations dengan unread count
     */
    public function getRelationsWithUnread()
    {
        /** @var User $user */
        $user = Auth::user();

        $relations = $user->relations()
            ->withPivot('is_owner', 'join_at')
            ->with(['lastMessage' => function ($query) {
                $query->latest();
            }])
            ->get()
            ->map(function ($relation) use ($user) {
                return [
                    'id' => $relation->id,
                    'kode' => $relation->kode,
                    'nama' => $relation->nama,
                    'deskripsi' => $relation->deskripsi,
                    'is_owner' => $relation->pivot->is_owner,
                    'join_at' => $relation->pivot->join_at,
                    'unread_count' => MessageRead::getUnreadCount($relation->id, $user->id),
                    'last_message_at' => $relation->lastMessage?->created_at,
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();

        return response()->json([
            'success' => true,
            'relations' => $relations,
        ]);
    }

    /**
     * Download file attachment
     */
    public function downloadFile(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($message->relation_id)) {
            abort(403, 'Unauthorized');
        }

        if (!$message->fileExists()) {
            abort(404, 'File not found');
        }

        $filePath = $message->getFilePath();
        return response()->download($filePath, $message->file_name);
    }

    /**
     * Display file (untuk image preview)
     */
    public function displayFile(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($message->relation_id)) {
            abort(403, 'Unauthorized');
        }

        if (!$message->fileExists()) {
            abort(404, 'File not found');
        }

        $file = Storage::disk('local')->get($message->file_path);
        $mimeType = $message->getFileMimeType();

        return response($file, 200)
            ->header('Content-Type', $mimeType);
    }

    /**
     * Generate thumbnail untuk image (simplified version)
     */
    public function thumbnail(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($message->relation_id)) {
            abort(403, 'Unauthorized');
        }

        if (!$message->isImageFile() || !$message->fileExists()) {
            abort(404, 'Image not found');
        }

        // Untuk sekarang return image asli
        // TODO: Implement image resizing dengan Intervention Image
        return $this->displayFile($message);
    }

    /**
     * Force delete message (hapus permanent + file)
     */
    public function forceDeleteMessage(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Hanya owner relation yang bisa force delete
        if (!$user->isOwnerOf($message->relation_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Force delete akan trigger auto delete file
        $message->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus permanent',
        ]);
    }

    /**
     * Mark pesan sebagai sudah dibaca
     */
    public function markAsRead(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'message_ids' => 'required|array',
            'message_ids.*' => 'exists:messages,id',
        ]);

        MessageRead::markMultipleAsRead($request->message_ids, $user);

        return response()->json([
            'success' => true,
            'message' => 'Pesan ditandai sudah dibaca',
        ]);
    }

    /**
     * Mark semua pesan dalam relation sebagai sudah dibaca
     */
    public function markAllAsRead($relationId)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($relationId)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        MessageRead::markAllAsReadInRelation($relationId, $user);

        return response()->json([
            'success' => true,
            'message' => 'Semua pesan ditandai sudah dibaca',
        ]);
    }

    /**
     * Get unread count untuk relation
     */
    public function getUnreadCount($relationId)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($relationId)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        $count = MessageRead::getUnreadCount($relationId, $user->id);

        return response()->json([
            'success' => true,
            'unread_count' => $count,
        ]);
    }

    /**
     * Toggle reaction pada pesan
     */
    public function toggleReaction(Request $request, Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'emoji' => 'required|string|max:10',
        ]);

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($message->relation_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        $added = MessageReaction::toggle(
            $message->id,
            $user->id,
            $request->emoji
        );

        // Get updated reactions
        $reactions = MessageReaction::getGroupedForMessage($message->id);

        // Broadcast reaction ke channel grup secara realtime
        try {
            broadcast(new MessageReacted($message->id, $message->relation_id, $reactions, $user->id))->toOthers();
        } catch (\Throwable $broadcastException) {
            \Log::warning('Broadcast MessageReacted failed: ' . $broadcastException->getMessage());
        }

        return response()->json([
            'success' => true,
            'added' => $added,
            'reactions' => $reactions,
        ]);
    }

    /**
     * Get reactions untuk pesan
     */
    public function getReactions(Message $message)
    {
        /** @var User $user */
        $user = Auth::user();

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($message->relation_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        $reactions = MessageReaction::getGroupedForMessage($message->id);

        return response()->json([
            'success' => true,
            'reactions' => $reactions,
        ]);
    }

    /**
     * Search messages dalam relation
     */
    public function searchMessages(Request $request, $relationId)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        // Validasi user adalah anggota relation
        if (!$user->hasJoinedRelation($relationId)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda bukan anggota grup ini',
            ], 403);
        }

        $messages = Message::forRelation($relationId)
            ->where('message', 'like', '%' . $request->query . '%')
            ->with(['user:id,name,email'])
            ->latestFirst()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }
}
