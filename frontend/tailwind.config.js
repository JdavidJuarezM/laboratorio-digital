/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                // 'Nunito' será la fuente por defecto para el cuerpo
                sans: ['Nunito', 'system-ui', 'sans-serif'],

                // 'Fredoka' será la fuente para los títulos
                heading: ['Fredoka', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
