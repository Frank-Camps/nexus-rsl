// layouts/theme/themeConfig.ts
import { PaletteMode } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: mode === 'light' ? '#1a237e' : '#90caf9',
        },
        background: {
            // Ton gris spécifique pour le fond
            default: mode === 'light' ? '#F9F8F6' : '#46454B',
            // On force le 'paper' à être identique ou très proche sans overlay auto
            paper: mode === 'light' ? '#FFFFFF' : '#333238',
        },
        text: {
            primary: mode === 'light' ? '#1a2027' : '#ffffff',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    // Ceci désactive l'effet d'élévation grisâtre automatique de MUI en Dark Mode
                    backgroundImage: 'none',
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
    // Tu pourras ajouter des overrides de composants ici plus tard (ex: boutons, inputs)
});