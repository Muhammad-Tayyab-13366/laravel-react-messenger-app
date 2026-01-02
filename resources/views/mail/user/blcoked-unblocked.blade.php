<x-mail::message>
Hello {{ $user->name }},

@if($user->blocked_at)
Your account has been <strong>blocked</strong>. You will not be able to access your account until it is unblocked by an administrator.
@else
Your account has been <strong>unblocked</strong>. You can now access your account normally.
<x-mail::button :url="route('login')">
Click here to login
</x-mail::button>
@endif

Thank you,<br>
{{ config('app.name') }}
    
</x-mail::message>