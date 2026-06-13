import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
    themeColor: '#f8fafc',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Les Arcs",
    description: "Ski Trip planner for Tignes",
    manifest: '/ski/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Tignes',
    },
    icons: {
        icon: [
            {
                url: '/ski/favicon.ico',
                sizes: 'any',
            },
            {
                url: '/ski/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                url: '/ski/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: '/ski/favicon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                url: '/ski/favicon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        apple: '/ski/favicon-192x192.png',
    },
};
