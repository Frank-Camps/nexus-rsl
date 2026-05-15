// layouts/theme/themeConfig.ts
import { PaletteMode } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            // Ta couleur Gold officielle devient la couleur principale de l'application
            main: '#ECC776',
            // Optionnel: ajout d'une variante plus claire pour les états au survol (hover)
            light: '#EECC7D',
            // Optionnel: ajustement du contraste du texte sur les boutons contenus (contained)
            contrastText: '#000000',
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
        MuiButton: {
            styleOverrides: {
                root: {
                    // Uniformise le style des boutons à travers l'application en capitalisant sur le thème
                    fontWeight: 'bold',
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
});