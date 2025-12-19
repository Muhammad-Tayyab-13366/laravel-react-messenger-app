<?php

namespace App\Models;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        "user_id1",
        "user_id2",
        "last_message_id"
    ];

    public function lastMessage(){
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function user1(){
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2(){
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getConversationsForSidebar(User $user)
    {
        $users = User::getUsersExpectUser($user);
        $groups = Group::getGrousForUsers($user);

        return $users->map(function(User $user){
            return $user->toConversationArray();
        })->concat($groups->map(function(Group $group){
            return $group->toConversationArray();
        }));
    }

    public static function updateConversationWithMessage($user_id1, $user_id2, $message){
        $conversation = Conversation::where(function($query) use ($user_id1, $user_id2){
            $query->where('user_id1', $user_id1)
            ->where('user_id2', $user_id2);
        })->orWhere(function($query) use ($user_id1, $user_id2){
            $query->where('user_id1', $user_id2)
            ->where('user_id2', $user_id1);
        })->first();

        if($conversation){
            $conversation->update([
                "last_message_id" => $message->id
            ]);
        }
        else {
            Conversation::create([
                'user_id1' => $user_id1,
                "user_id2" => $user_id2,
                "last_message_id" => $message->id
            ]);
        }
    }

    
    
}
