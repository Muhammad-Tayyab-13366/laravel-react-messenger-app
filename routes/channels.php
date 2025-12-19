<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});



Broadcast::channel('message.user.{userId1}-{userId2}', function(User $user, int $userId1, $userId2){

    return in_array($user->id, [$userId1, $userId2])
        ? $user
        : false;
   
});

Broadcast::channel('message.{groupId}', function(User $user, int $groupId){
    return $user->groups->contains('id', $groupId) ? $user : null;
});