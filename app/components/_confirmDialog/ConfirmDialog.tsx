'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button, useTheme
} from '@mui/material';

// 1. Définition des types pour notre système de promesse
interface ConfirmOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

interface ConfirmContextType {
    askConfirmation: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

// 2. Le Provider qu'on va mettre autour de l'application
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({ title: '', description: '' });

    // C'est ici qu'on stocke la fonction de résolution de notre promesse
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

    const askConfirmation = useCallback((targetOptions: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setOptions(targetOptions);
            setOpen(true);
            setResolveRef(() => resolve); // On garde la possibilité de répondre plus tard
        });
    }, []);

    const handleCancel = () => {
        setOpen(false);
        if (resolveRef) resolveRef(false); // Renvoie false au await
    };

    const handleConfirm = () => {
        setOpen(false);
        if (resolveRef) resolveRef(true); // Renvoie true au await
    };

    return (
        <ConfirmContext.Provider value={{ askConfirmation }}>
            {children}
            <Dialog
                open={open}
                onClose={handleCancel}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, minWidth: 350 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
                    {options.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'text.secondary' }}>
                        {options.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        color="inherit"
                        sx={{ fontWeight: 'bold', borderRadius: 2 }}
                    >
                        {options.cancelText || 'Annuler'}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        color={options.isDanger ? 'error' : 'primary'}
                        sx={{ fontWeight: 'bold', borderRadius: 2, px: 3 }}
                        autoFocus
                    >
                        {options.confirmText || 'Confirmer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmContext.Provider>
    );
}

// 3. Le Hook personnalisé que tu vas appeler dans tes pages
export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm doit être utilisé à l'intérieur d'un ConfirmProvider");
    }
    return context.askConfirmation;
}