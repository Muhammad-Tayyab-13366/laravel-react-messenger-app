<?php

namespace App\Models;
use App\Models\User;
use App\Models\MessageAttachment;
use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
#[ObservedBy(MessageObserver::class)]
class Message extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "message",
        "sender_id",
        "receiver_id",
        "group_id",
        "converstion_id"
    ];

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function attachments(){
        return $this->hasMany(MessageAttachment::class);
    }
}