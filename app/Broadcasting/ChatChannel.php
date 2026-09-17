<?php
// app/Broadcasting/ChatChannel.php

namespace App\Broadcasting;

use App\Models\Relation;
use App\Models\User;

class ChatChannel
{
    /**
     * Create a new channel instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     *
     * @param  \App\Models\User  $user
     * @param  int  $relationId
     * @return array|bool
     */
    public function join(User $user, $relationId)
    {
        // Check if user is a member of the relation
        return $user->hasJoinedRelation($relationId);
    }
}
