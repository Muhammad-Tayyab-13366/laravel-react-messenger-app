<x-mail::message>
Hello {{ $user->name }},

@if($user->is_admin)
    Your role has been changed to <strong>Administrator</strong>. You now have administrative privileges.
@else
    Your role has been changed to <strong>Regular User</strong>. Your administrative privileges have been revoked.
@endif  
<br>

Thank you,<br>
{{ config('app.name') }}    

</x-mail::message>