<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Halaman daftar notifikasi (Inertia render).
     */
    public function index(Request $request)
    {
        $notifications = Notification::forUser($request->user()->id)
            ->with(['actor:id,name,avatar', 'relation:id,nama'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($n) => [
                'id'            => $n->id,
                'type'          => $n->type,
                'title'         => $n->title,
                'body'          => $n->body,
                'url'           => $n->url,
                'read_at'       => $n->read_at?->toIso8601String(),
                'created_at'    => $n->created_at->toIso8601String(),
                'actor_name'    => $n->actor?->name,
                'actor_avatar'  => $n->actor?->avatar_url,
                'relation_name' => $n->relation?->nama,
            ]);

        return Inertia::render('NotificationsPage', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * JSON endpoint: jumlah notifikasi belum dibaca.
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::forUser($request->user()->id)
            ->unread()
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Tandai satu notifikasi sebagai dibaca.
     */
    public function markRead(Request $request, Notification $notification)
    {
        $this->authorize('update', $notification);
        $notification->markAsRead();

        return response()->json(['ok' => true]);
    }

    /**
     * Tandai notifikasi sebagai dibaca dan redirect ke target URL.
     */
    public function readAndGo(Request $request, Notification $notification)
    {
        $this->authorize('update', $notification);

        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        if ($notification->url) {
            $path = parse_url($notification->url, PHP_URL_PATH);
            $query = parse_url($notification->url, PHP_URL_QUERY);
            $target = $path ? ($path . ($query ? '?' . $query : '')) : $notification->url;

            return redirect($target);
        }

        return redirect()->route('notifications.index');
    }

    /**
     * Tandai semua notifikasi user sebagai dibaca.
     */
    public function markAllRead(Request $request)
    {
        Notification::forUser($request->user()->id)
            ->unread()
            ->update(['read_at' => now()]);

        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    /**
     * Hapus satu notifikasi.
     */
    public function destroy(Request $request, Notification $notification)
    {
        $this->authorize('delete', $notification);
        $notification->delete();

        return back();
    }
}
