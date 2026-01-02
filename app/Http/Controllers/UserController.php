<?php

namespace App\Http\Controllers;

use App\Mail\UserBlockedUnblocked;
use App\Mail\UserCreated;
use App\Mail\UserRoleChanged;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    //

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'is_admin' => 'required|boolean',
        ]);

        $rawPassword = Str::random(10);
        $rawPassword = "12345678"; // For testing purpose only, remove this line in production
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();
        
        $user  = User::create($data);   

        Mail::to($user->email)->send(new UserCreated($user, $rawPassword));

        return redirect()->back();
    }

    public function changeRole(User $user)
    {
        //
        $is_admin = !(bool) $user->is_admin;
        $user->update([
            'is_admin' => $is_admin
        ]);

        $message = $user->is_admin ? 'User promoted to admin successfully.' : 'User demoted to regular user successfully.';
        
        Mail::to($user->email)->send(new UserRoleChanged($user));

        return response()->json([
            'message' => $message,
            "is_admin" => $is_admin
        ]);
    }

    public function blockUnblock(User $user)
    {
        //
        if($user->id === auth()->user()->id){
            return response()->json([
                'message' => "You cannot block/unblock yourself."
            ], 403);
        }

        if($user->blocked_at){
            //unblock
           $user->blocked_at = null;
           $user->save();   
           Mail::to($user->email)->send(new UserBlockedUnblocked($user));
              return response()->json([
                'message' => "User '".$user->name."' has been unblocked.",
                'blocked_at' => $user->blocked_at
              ]);
        }else{
            //block
            $user->blocked_at = now();
            $user->save();   
            Mail::to($user->email)->send(new UserBlockedUnblocked($user));
               return response()->json([
                    'message' => "User '".$user->name."' has been bloacked."   ,
                    'blocked_at' => $user->blocked_at
                ]);
        }

    }
}
