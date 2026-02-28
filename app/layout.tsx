import type { Metadata } from "next";
import "./globals.css";
// On utilise l'alias @/ pour pointer vers la racine de ton projet
import Navigation from "@/layouts/Navigation";
import ThemeRegistry from "@/layouts/ThemeRegistry";
import { Box, Toolbar } from "@mui/material";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nexus RSL",
    description: "Application d'informations centralisée RSL",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeRegistry>
            {/* 1. On affiche la barre de navigation et le Drawer */}
            <Navigation />

            {/* 2. On crée un espace de contenu décalé pour ne pas être SOUS le Drawer fixe */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `240px` } }}>
                {/* Le Toolbar ici sert à pousser le contenu sous la AppBar du haut */}
                <Toolbar />
                {children}
            </Box>
        </ThemeRegistry>
        </body>
        </html>
    );
}