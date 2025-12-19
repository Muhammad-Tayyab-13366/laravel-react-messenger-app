import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import theme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // ✅ REQUIRED
    content: [
        // './resources/**/*.blade.php',
        // './resources/**/*.jsx',
        // './resources/**/*.js',
        // './resources/**/*.ts',
        // './resources/**/*.tsx',
        // './storage/framework/views/*.php',
        // './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './resources/**/*.{blade.php,js,jsx,ts,tsx}',  // all Blade + React files
        './storage/framework/views/*.php',
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
        screens:{
            xs: "420px",
            sm: "680px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        }
    },

    plugins: [forms,require("daisyui")],
    
    daisyui : {
        themes: true,
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
        prefix: "",
        logs: true,
        themeRoot: ":root",

    }
    
};
