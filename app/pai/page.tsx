'use client'

import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Typography, Box, Chip, IconButton, Stack,
    MenuItem, Select, FormControl, InputLabel,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, useTheme
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import GiteIcon from '@mui/icons-material/Gite';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Grid from '@mui/material/Grid'

// Tes interfaces
import { IPaiEvent } from './interfaces/PaiEvent';

export default function PageAI() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<IPaiEvent | null>(null);

    // Mock Data pour tester le visuel
    const fiches: IPaiEvent[] = [
        {
            id: '1', date: '2026-04-27', shift: 'Jour', sector: '1', event: 'Vol qualifié', fileNumber: 'PDQ-260427-001',
            address: { civicNumber: '123', street: 'rue Principale', city: 'Saint-Jean', zipCode: 'J3B 1A1' },
            persons: [
                { lastname: 'Tremblay', firstname: 'Jean', personStatus: 'Suspect', birthDate: '1985-03-22' },
                { lastname: 'Lavoie', firstname: 'Sophie', personStatus: 'Victime', birthDate: '1992-07-12' }
            ],
            cars: [{ plate: 'ABC 123', brand: 'Honda', model: 'Civic', carStatus: 'Suspect' }],
            notes: 'L’individu a pris la fuite vers le sud par la ruelle arrière. Armé d’un couteau de cuisine.', createdAt: '2026-04-27T10:00:00Z'
        }
    ];

    const handleOpenModal = (event: IPaiEvent) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const InfoCard = ({ icon, title, children, color }: any) => (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5, borderRadius: 3,
                borderTop: `5px solid ${color || theme.palette.primary.main}`,
                bgcolor: isDark ? '#3d3c42' : '#ffffff',
                backgroundImage: 'none',
                height: '100%'
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: isDark ? '#46454B' : '#f0f2f5', color: color || theme.palette.primary.main, width: 32, height: 32 }}>
                    {icon}
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
                    {title}
                </Typography>
            </Stack>
            {children}
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>Registre des Informations (PAI)</Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: isDark ? '#3d3c42' : '#fafafa' }}>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Secteur</strong></TableCell>
                            <TableCell><strong>Quart</strong></TableCell>
                            <TableCell><strong>Individu</strong></TableCell>
                            <TableCell><strong>Nature</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fiches.map((fiche) => (
                            <TableRow key={fiche.id} hover>
                                <TableCell>{fiche.date}</TableCell>
                                <TableCell>S-{fiche.sector}</TableCell>
                                <TableCell><Chip label={fiche.shift.toUpperCase()} size="small" color="primary" sx={{ fontWeight: 800 }} /></TableCell>
                                <TableCell>{fiche.persons?.[0]?.lastname?.toUpperCase()}</TableCell>
                                <TableCell>{fiche.event}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpenModal(fiche)}><VisibilityIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* MODAL AVEC GRID2 */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
                PaperProps={{ sx: { borderRadius: 4, bgcolor: isDark ? '#333238' : '#F9F8F6' } }}
            >
                {selectedEvent && (
                    <>
                        <DialogTitle sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>{selectedEvent.event}</Typography>
                                    <Typography variant="body2" color="text.secondary">Dossier: <strong>{selectedEvent.fileNumber}</strong></Typography>
                                </Box>
                                <IconButton onClick={() => setOpen(false)} sx={{ bgcolor: isDark ? '#46454B' : '#eee' }}><CloseIcon fontSize="small"/></IconButton>
                            </Stack>
                        </DialogTitle>

                        <DialogContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>

                                {/* LIGNE 1: MOMENT (SIZE 5) ET ADRESSE (SIZE 7) */}
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <InfoCard title="Moment" icon={<CalendarMonthIcon fontSize="small"/>} color={theme.palette.primary.main}>
                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedEvent.date}</Typography>
                                        <Typography variant="subtitle1" color="text.secondary">Quart de {selectedEvent.shift}</Typography>
                                    </InfoCard>
                                </Grid>
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <InfoCard title="Adresse de l'événement" icon={<GiteIcon fontSize="small"/>} color="#2e7d32">
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {selectedEvent.address ? `${selectedEvent.address.civicNumber} ${selectedEvent.address.street}` : 'N/A'}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">{selectedEvent.address?.city} • Secteur {selectedEvent.sector}</Typography>
                                    </InfoCard>
                                </Grid>

                                {/* LIGNE 2: PERSONNES (SIZE 12) */}
                                <Grid size={12}>
                                    <InfoCard title="Personnes Impliquées" icon={<PersonIcon fontSize="small"/>} color="#1a237e">
                                        <Grid container spacing={2}>
                                            {selectedEvent.persons?.map((p, i) => (
                                                <Grid size={12} key={i}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        alignItems="center"
                                                        justifyContent="space-between" // Pousse le statut à la fin
                                                        onClick={() => console.log(`Redirection vers la fiche de ${p.firstname}`)} // Futur lien
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            bgcolor: isDark ? '#46454B' : '#f5f5f5',
                                                            border: '1px solid #ddd',
                                                            cursor: 'pointer', // Curseur main pour indiquer que c'est cliquable
                                                            transition: '0.2s',
                                                            '&:hover': {
                                                                bgcolor: isDark ? '#55545d' : '#ececec', // Effet de survol
                                                                borderColor: theme.palette.primary.main,
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar sx={{ bgcolor: theme.palette.primary.main, fontWeight: 'bold' }}>
                                                                {p.lastname?.[0]}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                                                                    {p.lastname?.toUpperCase()}, {p.firstname}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Né le: {p.birthDate || 'Inconnu'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        {/* Statut à la fin de la card */}
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 900,
                                                                color: p.personStatus?.toLowerCase() === 'suspect' ? 'error.main' : theme.palette.primary.main,
                                                                pr: 1
                                                            }}
                                                        >
                                                            {p.personStatus?.toUpperCase()}
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </InfoCard>
                                </Grid>

                                {/* LIGNE 3: VÉHICULES (SIZE 12) */}
                                <Grid size={12}>
                                    <InfoCard title="Véhicules Associés" icon={<DirectionsCarIcon fontSize="small"/>} color="#d32f2f">
                                        <Grid container spacing={2}>
                                            {selectedEvent.cars?.length ? selectedEvent.cars.map((v, i) => (
                                                <Grid size={12} key={i}>
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        alignItems="center"
                                                        justifyContent="space-between" // Pousse le statut à la fin
                                                        onClick={() => console.log(`Redirection vers la fiche du véhicule ${v.plate}`)} // Futur lien
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            bgcolor: isDark ? '#46454B' : '#fff',
                                                            border: '1px solid #ddd',
                                                            cursor: 'pointer',
                                                            transition: '0.2s',
                                                            '&:hover': {
                                                                bgcolor: isDark ? '#55545d' : '#f8f9fa',
                                                                borderColor: theme.palette.error.main, // Rouge car c'est un véhicule
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                                                            }
                                                        }}
                                                    >
                                                        {/* Bloc Gauche: Icone et Infos Véhicule */}
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                                                                <DirectionsCarIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 900, letterSpacing: 1.5 }}>
                                                                    {v.brand || 'Marque inconnue'} {v.model || 'Modèle inconnu'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {v.plate?.toUpperCase() || 'SANS PLAQUE'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>

                                                        {/* Statut à la fin de la card en Body 1 Gras */}
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 900,
                                                                color: v.carStatus?.toLowerCase() === 'volé' ? 'error.main' : 'text.primary',
                                                                pr: 1
                                                            }}
                                                        >
                                                            {v.carStatus?.toUpperCase()}
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            )) : (
                                                <Grid size={12}>
                                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', p: 1 }}>
                                                        Aucun véhicule répertorié pour cet événement.
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </InfoCard>
                                </Grid>

                                {/* LIGNE 4: DESCRIPTION (SIZE 12) */}
                                <Grid size={12}>
                                    <InfoCard title="Description de l'événement" icon={<DescriptionIcon fontSize="small"/>} color="#ed6c02">
                                        <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: isDark ? 'rgba(237, 108, 2, 0.05)' : '#fffdf5', border: '1px dashed #ed6c02' }}>
                                            <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                                                "{selectedEvent.notes}"
                                            </Typography>
                                        </Box>
                                    </InfoCard>
                                </Grid>

                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setOpen(false)} variant="contained" sx={{ px: 4, fontWeight: 700 }}>Fermer</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}