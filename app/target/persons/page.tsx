'use client';

import React, { useState } from 'react';
import {
    Box, Typography, Stack, Button, TextField,
    InputAdornment, useTheme, CircularProgress, Paper,
    ToggleButton, ToggleButtonGroup, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Avatar, Chip,
    Container
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Icon from '@mdi/react';
import { mdiAccountMultipleCheck, mdiFilterVariant } from '@mdi/js';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { queryer, sendMutation } from '@/lib/axios';
import PersonCard from '@/app/target/persons/_components/PersonCard';
import PersonDialog from '@/app/target/persons/_components/PersonDialog';
import {getPersonsAction} from "../../../server/persons/getPersons";
import {router} from "next/client";
import {IPerson} from "@/interfaces/person/person";
import {deletePersonByIdAction} from "@/server/persons/deletePersonById";
import {savePersonAction} from "@/server/persons/savePerson";

export default function PersonsPage() {
    const theme = useTheme();

    // --- ÉTATS ---
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<IPerson | null>(null);


    const { data: fetchResult, isLoading, mutate } = useSWR('/api/persons?isTarget=true', async () => {
        const res = await getPersonsAction(true); // true pour isTargetOnly
        if (!res.success) {
            throw new Error(res.error);
        }
        return res.data;
    });

    const persons = fetchResult || [];

    const { trigger: triggerSave } = useSWRMutation(
        '/api/persons?isTarget=true',
        async (url, { arg }: { arg: IPerson }) => {
            // arg sera le payload qu'on passe au trigger
            const res = await savePersonAction(arg);
            if (!res.success) throw new Error(res.error);
            return res;
        },
        {
            onSuccess: () => {
                // Ces actions s'exécutent uniquement si le serveur répond { success: true }
                setOpenDialog(false);
                setSelectedPerson(null);
            },
            onError: (error) => {
                console.error("❌ Erreur SWR:", error.message);
            }
        }
    );

    // --- DONNÉES (CRÉATION) ---
    const { trigger: triggerDelete } = useSWRMutation('/api/persons?isTarget=true', async (url, { arg }: { arg: string }) => {
            const res = await deletePersonByIdAction(arg);
            if (!res.success) throw new Error(res.error);
            return res;
    });

    // --- LOGIQUE ---
    const handleViewChange = (event: React.MouseEvent<HTMLElement>, nextView: 'grid' | 'list') => {
        if (nextView !== null) setViewMode(nextView);
    };

    const handleSavePerson = async (person: IPerson) => {
        try {
            // 1. Préparation des données
            const payload = selectedPerson?._id
                ? { ...person, _id: selectedPerson._id }
                : person;

            await triggerSave(payload);

        } catch (error: unknown) {
            console.error("Erreur inattendue:", error instanceof Error ? error.message : error);
        }
    };

    const handleEditPerson = (person: IPerson) => {
        setSelectedPerson(person);
        setOpenDialog(true);
    };

    const handleDeletePerson = async (personId: string) => {
        try {
            await triggerDelete(personId);
        } catch (error: unknown) {
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Impossible de récupérer les individus."
            };
        }
    };

    // Filtrage local pour la recherche
    const filteredPersons = persons.filter((p: IPerson) =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.fps?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress size={60} />
        </Box>
    );

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>

            {/* HEADER ET ACTIONS PRINCIPALES */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                sx={{ mb: 4 }}
                spacing={2}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{
                        p: 1.5, borderRadius: 1.5,
                        backgroundColor: theme.palette.primary.main,
                        color: 'white', display: 'flex',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <Icon path={mdiAccountMultipleCheck} size={1.5} />
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
                            Individus d&#39;Intérêt
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {filteredPersons.length} sujet(s) actuellement sous surveillance
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewChange}
                        size="small"
                        sx={{ backgroundColor: 'background.paper' }}
                    >
                        <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
                        <ToggleButton value="list"><ViewListIcon /></ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{ fontWeight: 'bold', px: 4, height: 48, borderRadius: 2 }}
                    >
                        Nouveau Sujet
                    </Button>
                </Stack>
            </Stack>

            {/* BARRE DE RECHERCHE */}
            <Paper sx={{ p: 2, mb: 4, borderRadius: 3, backgroundImage: 'none', border: `1px solid ${theme.palette.divider}` }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 9 }}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher par nom, alias, FPS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Icon path={mdiFilterVariant} size={0.8} />}
                            sx={{ height: '56px', borderRadius: 2, fontWeight: 'bold' }}
                        >
                            Filtres Avancés
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* CONTENU : GRILLE OU LISTE */}
            {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                    {filteredPersons.map((person: IPerson) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={person._id}>
                            <PersonCard
                                person={person}
                                onDelete={async (personId: string) => {await handleDeletePerson(personId)}}
                                onEdit={(person: IPerson) => handleEditPerson(person)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none', overflow: 'hidden' }}>
                    <Table size="medium">
                        <TableHead sx={{ backgroundColor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Identité / Sujet</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Dossier FPS</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Origine</TableCell>
                                <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Statut</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPersons.map((p: IPerson, index: number) => (
                                <TableRow key={p._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar src={p.filesRelated?.[0]} variant="rounded" sx={{ width: 40, height: 45, borderRadius: 1 }} />
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', lineHeight: 1.2 }}>
                                                    {p.lastname}, {p.firstname}
                                                </Typography>
                                                {p.nickname && <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>{p.nickname}</Typography>}
                                            </Box>
                                            {p.wanted && <Chip label="WANTED" size="small" color="error" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900 }} />}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'error.main' }}>
                                            {p.fps || '---'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{p.origin?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.personStatus?.name || 'Inconnu'}
                                            size="small"
                                            variant="tonal" // ou outlined selon ton thème
                                            color={p.personStatus?.name === 'Actif' ? 'success' : 'default'}
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="text"
                                            onClick={() => handleEditPerson(p)}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* DIALOG DE CRÉATION RÉUTILISABLE */}
            <PersonDialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false)
                    setSelectedPerson(null);
                }}
                onSave={handleSavePerson}
                initialData={selectedPerson}
            />

        </Container>
    );
}