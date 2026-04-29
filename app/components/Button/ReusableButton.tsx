'use client'

import React from 'react';
import { Button } from '@mui/material';

interface ReusableButtonProps {
    title: string;
    action: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    startIcon?: React.ReactNode; // Prop pour l'icône de début
    fullWidth?: boolean;
    disabled?: boolean;
}

const ReusableButton = ({
                            title,
                            action,
                            variant = 'contained',
                            color = 'primary',
                            startIcon,
                            fullWidth = false,
                            disabled = false
                        }: ReusableButtonProps) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={action}
            startIcon={startIcon}
            fullWidth={fullWidth}
            disabled={disabled}
            sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
                height: 42,
                // On s'assure que le bouton garde une allure pro même avec une icône
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}
        >
            {title}
        </Button>
    );
};

export default ReusableButton;