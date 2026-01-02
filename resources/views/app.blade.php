<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class=" overflow-hidden h-screen" >
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite([
            'resources/css/app.css',                     {{-- Load Tailwind first --}}
            'resources/js/app.jsx',                      {{-- Main JS --}}
            "resources/js/Pages/{$page['component']}.jsx" {{-- Page-specific JS --}}
        ])
        
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-white dark:bg-gray-900 text-black dark:text-white h-screen">
        @inertia
    </body>
</html>
