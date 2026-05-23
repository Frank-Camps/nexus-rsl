'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card, CardContent, Typography, Avatar, Box, Chip,
    Stack, CardActionArea, useTheme, IconButton, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IPerson } from "@/interfaces/person/person";
import {useConfirm} from "@/app/components/_confirmDialog/ConfirmDialog";

interface PersonCardProps {
    person: IPerson;
    onEdit?: (person: IPerson) => void;
    onDelete?: (id: string) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
    const theme = useTheme();
    const router = useRouter();
    const askConfirmation = useConfirm();

    // --- ÉTAT DU MENU DÉROULANT ---
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Empêche de déclencher le CardActionArea
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const calculateAge = (birthday: string | Date | undefined) => {
        if (!birthday) return 'N/A';
        const ageDifMs = Date.now() - new Date(birthday).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) + " ans";
    };

    const handleNavigate = () => {
        router.push(`/target/persons/${person._id}`);
    };

    const handleEditAction = (event: React.MouseEvent) => {
        handleMenuClose(event);
        if (onEdit) onEdit(person);
    };

    const handleDeleteAction = async (event: React.MouseEvent) => {
        handleMenuClose(event);
        const confirmed = await askConfirmation({
            title: "Supprimer la fiche ?",
            description: `Êtes-vous sûr de vouloir retirer ${person.firstname} ${person.lastname} des individus d'intérêt ? Cette action est irréversible.`,
            confirmText: "Supprimer",
            cancelText: "Annuler",
            isDanger: true // Met le bouton de confirmation en rouge
        });

        // Si l'utilisateur clique sur Annuler, on arrête tout ici
        if (!confirmed) return;

        // Si confirmé, on déclenche le onDelete reçu du parent
        if (onDelete && person._id) {
            onDelete(person._id);
        }
    };

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 2,
            border: person.wanted ? `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Indicateur de statut */}
            <Box sx={{
                height: 4,
                width: '100%',
                backgroundColor: person.wanted ? 'error.main' : (person.personStatus as any)?.name === 'Actif' ? 'success.main' : 'grey.500'
            }} />

            {/* BOUTON RECHERCHÉ OU PETIT MENU DÉROULANT EN HAUT À DROITE */}
            <Box sx={{ position: 'absolute', top: 12, right: 8, zIndex: 2 }}>
                <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: '#fff' }, boxShadow: 1 }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()} // Sécurité supplémentaire
                    PaperProps={{
                        elevation: 3,
                        sx: { borderRadius: '8px', minWidth: 150 }
                    }}
                >
                    <MenuItem onClick={handleNavigate}>
                        <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                        <Typography variant="body2">Consulter</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleEditAction}>
                        <ListItemIcon><EditIcon fontSize="small" color="primary" /></ListItemIcon>
                        <Typography variant="body2">Modifier</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDeleteAction} sx={{ color: 'error.main' }}>
                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                        <Typography variant="body2">Supprimer</Typography>
                    </MenuItem>
                </Menu>
            </Box>

            <CardActionArea onClick={handleNavigate} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CardContent sx={{ p: 2, width: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                            src={person.filesRelated?.[0]}
                            variant="rounded"
                            sx={{ width: 80, height: 100, borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}
                        />
                        <Box sx={{ overflow: 'hidden', flex: 1, pr: 3 }}> {/* pr: 3 pour éviter d'empiéter sur les 3 points */}
                            <Typography variant="caption" color={person.wanted ? "error" : "text.secondary"} sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>
                                {person.wanted ? '⚠️ RECHERCHÉ' : ``}
                            </Typography>
                            <Typography variant="h6" noWrap sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, mb: 0.5 }}>
                                {person.lastname}
                            </Typography>
                            <Typography variant="body2" color="primary.main" noWrap sx={{ fontWeight: 'bold' }}>
                                {person.firstname}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack spacing={0.8} sx={{ mt: 2.5 }}>
                        <DataRow label="DDN" value={person.birthDate} color="error.main" bold />
                        <DataRow label="Âge" value={calculateAge(person.birthDate)} />
                        <DataRow label="Dossier SAAQ" value={person.diverLicence} />
                    </Stack>
                </CardContent>
            </CardActionArea>

            <Box
                onClick={handleNavigate}
                sx={{
                    width: '100%',
                    p: 1.5,
                    textAlign: 'center',
                    backgroundColor: 'action.hover',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                    },
                    transition: '0.2s ease'
                }}
            >
                CONSULTER LE PROFIL
            </Box>
        </Card>
    );
}

function DataRow({ label, value, color = 'text.primary', bold = false }: any) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography variant="caption" sx={{ color: color, fontWeight: bold ? 800 : 500, fontSize: '0.75rem' }}>
                {value || '---'}
            </Typography>
        </Stack>
    );
}