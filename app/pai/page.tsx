'use client'

import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Typography, Box, Chip, IconButton, Stack,
    MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function PageAI() {
    // États pour les filtres
    const [recherche, setRecherche] = useState('');
    const [secteur, setSecteur] = useState('Tous');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');

    // Données de test mises à jour avec le "Quart"
    const fiches = [
        {
            id: '1',
            date: '2026-04-27',
            secteur: '1',
            quart: 'Jour',
            nom: 'Tremblay',
            prenom: 'Jean',
            nature: 'Vol qualifié',
            dossier: 'PDQ-260427-001'
        },
        {
            id: '2',
            date: '2026-04-25',
            secteur: '3',
            quart: 'Nuit',
            nom: 'Gagnon',
            prenom: 'Marc',
            nature: 'Rôdeur nuit',
            dossier: 'PDQ-260425-042'
        },
        {
            id: '3',
            date: '2026-04-25',
            secteur: '2',
            quart: 'Soir',
            nom: 'Bouchard',
            prenom: 'Luc',
            nature: 'Véhicule suspect',
            dossier: 'PDQ-260425-088'
        }
    ];

    // Fonction pour donner une couleur différente selon le quart de travail
    const getQuartColor = (quart: string) => {
        switch (quart.toLowerCase()) {
            case 'jour': return { color: 'warning', label: 'JOUR' }; // Orange/Jaune
            case 'soir': return { color: 'info', label: 'SOIR' };    // Bleu
            case 'nuit': return { color: 'secondary', label: 'NUIT' }; // Violet/Sombre
            default: return { color: 'default', label: quart };
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Registre des Informations (PAI)
            </Typography>

            {/* Section des Filtres */}
            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">

                    <TextField
                        fullWidth
                        label="Recherche rapide (Nom, Dossier...)"
                        variant="outlined"
                        size="small"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Secteur</InputLabel>
                        <Select
                            value={secteur}
                            label="Secteur"
                            onChange={(e) => setSecteur(e.target.value)}
                        >
                            <MenuItem value="Tous">Tous les secteurs</MenuItem>
                            <MenuItem value="1">Secteur 1</MenuItem>
                            <MenuItem value="2">Secteur 2</MenuItem>
                            <MenuItem value="3">Secteur 3</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Depuis le"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 160 }}
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                    />

                    <TextField
                        label="Jusqu'au"
                        type="date"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 160 }}
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                    />
                </Stack>
            </Paper>

            {/* Tableau des fiches */}
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
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
                        {fiches.map((fiche) => {
                            const quartStyle = getQuartColor(fiche.quart);
                            return (
                                <TableRow key={fiche.id} hover>
                                    <TableCell>{fiche.date}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">Secteur {fiche.secteur}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={quartStyle.label}
                                            size="small"
                                            color={quartStyle.color as any}
                                            sx={{ fontWeight: 'bold', width: 80 }}
                                        />
                                    </TableCell>
                                    <TableCell>{`${fiche.nom.toUpperCase()}, ${fiche.prenom}`}</TableCell>
                                    <TableCell>{fiche.nature}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}