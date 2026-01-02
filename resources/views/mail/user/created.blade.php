<x-mail::message>
Hello {{ $user->name }},

Your account has been successfully created. Below are your login details: <br><br>
Email: {{ $user->email }} <br>
Password: {{ $rawPassword }} <br><br>
Please make sure to change your password after your first login for security reasons.

<x-mail::button :url="route('login')">
Login to Your Account
</x-mail::button>
Thank you for joining us! <br>
Regards, <br>
{{ config('app.name') }}

</x-mail::message>