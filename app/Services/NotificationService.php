<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Relation;

class NotificationService
{
    /**
     * Kirim notifikasi ke satu user.
     */
    public static function send(
        int $userId,
        ?int $actorId,
        ?int $relationId,
        string $type,
        string $title,
        string $body,
        ?string $url = null
    ): Notification {
        return Notification::create([
            'user_id'     => $userId,
            'actor_id'    => $actorId,
            'relation_id' => $relationId,
            'type'        => $type,
            'title'       => $title,
            'body'        => $body,
            'url'         => $url,
        ]);
    }

    /**
     * Kirim notifikasi ke semua anggota relation, kecuali si actor.
     */
    public static function sendToGroupMembers(
        Relation $relation,
        int $actorId,
        string $type,
        string $title,
        string $body,
        ?string $url = null
    ): void {
        $memberIds = $relation->users()
            ->where('users.id', '!=', $actorId)
            ->pluck('users.id');

        foreach ($memberIds as $memberId) {
            self::send($memberId, $actorId, $relation->id, $type, $title, $body, $url);
        }
    }

    /**
     * Kirim notifikasi ke owner(s) dari sebuah relation.
     */
    public static function sendToOwners(
        Relation $relation,
        int $actorId,
        string $type,
        string $title,
        string $body,
        ?string $url = null
    ): void {
        $ownerIds = $relation->users()
            ->where('user_relation.is_owner', true)
            ->where('users.id', '!=', $actorId)
            ->pluck('users.id');

        foreach ($ownerIds as $ownerId) {
            self::send($ownerId, $actorId, $relation->id, $type, $title, $body, $url);
        }
    }
}
