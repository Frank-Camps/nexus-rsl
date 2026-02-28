'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import {getThemeOptions} from "@/config/theme/themeConfig";

// Création d'un context pour changer le thème de n'importe où
const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    // Sauvegarder la préférence dans le navigateur
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
        if (savedMode) setMode(savedMode);
    }, []);

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => {
                const newMode = prevMode === 'light' ? 'dark' : 'light';
                localStorage.setItem('themeMode', newMode);
                return newMode;
            });
        },
    }), []);

    const theme = useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </ColorModeContext.Provider>
    );
}