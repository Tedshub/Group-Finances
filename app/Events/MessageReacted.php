<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageReacted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageId;
    public $relationId;
    public $reactions;
    public $userId;

    /**
     * Create a new event instance.
     *
     * @param int $messageId
     * @param int $relationId
     * @param mixed $reactions
     * @param int|null $userId
     * @return void
     */
    public function __construct($messageId, $relationId, $reactions, $userId = null)
    {
        $this->messageId = $messageId;
        $this->relationId = $relationId;
        $this->reactions = $reactions;
        $this->userId = $userId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->relationId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'MessageReacted';
    }
}
