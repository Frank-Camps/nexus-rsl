'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { queryer } from '@/lib/services/axios';
import {
    Box, Paper, Typography, Stack, Avatar, Chip,
    Button, CircularProgress, Breadcrumbs, Link,
    useTheme, Container, List, ListItemButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import Icon from '@mdi/react';
import { mdiAccountMultiple, mdiInformationOutline } from '@mdi/js';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function VehicleDetailsPage({ params }: PageProps) {
    const theme = useTheme();
    const router = useRouter();
    const { id } = use(params);

    const { data: vehicle, isLoading, error } = useSWR(id ? `/api/vehicles/${id}` : null, queryer);

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress size={60} />
        </Box>
    );

    if (error || !vehicle) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>⚠️ Erreur de chargement</Typography>
            <Typography sx={{ mb: 3 }}>Le véhicule recherché est introuvable.</Typography>
            <Button variant="contained" sx={{ borderRadius: '6px' }} onClick={() => router.push('/target/cars')}>
                Retour à la liste
            </Button>
        </Box>
    );

    const brandName = vehicle.brand?.name || 'Inconnue';
    const modelName = vehicle.model?.name || 'Inconnu';
    const colorName = vehicle.color?.name || 'Non définie';
    const statusName = vehicle.carStatus?.name || 'Non défini';
    const yearStr = vehicle.year || 'Année inconnue';

    return (
        <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 } }}>
            {/* FIL D'ARIANE */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', gap: 0.5, fontSize: '0.85rem' }} onClick={() => router.push('/')}>
                    <HomeIcon fontSize="inherit" /> Accueil
                </Link>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', gap: 0.5, fontSize: '0.85rem' }} onClick={() => router.push('/target/cars')}>
                    <DirectionsCarIcon fontSize="inherit" /> Véhicules d'Intérêt
                </Link>
                <Typography sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    Plaque : {vehicle.plate?.toUpperCase()}
                </Typography>
            </Breadcrumbs>

            {/* EN-TÊTE DE LA PAGE */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
                        Fiche Véhicule
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Dernière modification : {new Date(vehicle.updatedAt || vehicle.createdAt).toLocaleString()}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<PrintIcon />} size="small" sx={{ borderRadius: '6px' }}>Imprimer</Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                    >
                        Modifier
                    </Button>
                </Stack>
            </Stack>

            {/* 🟦 SECTION 1 : L'EN-TÊTE BLOC HÉRO CONDENSÉ */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: '6px', mb: 3, bgcolor: '#ffffff' }}>
                <Grid container spacing={4} alignItems="center">

                    {/* Graphisme de la Plaque d'immatriculation */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{
                            bgcolor: '#f8f9fa',
                            border: '2px solid #333',
                            borderRadius: '4px',
                            p: 2,
                            textAlign: 'center',
                            boxShadow: 'inset 0px 0px 5px rgba(0,0,0,0.1)',
                            maxWidth: '280px',
                            mx: { xs: 'auto', md: 0 }
                        }}>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: 'text.secondary', letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.65rem', mb: 0.5 }}>
                                Québec - Je me souviens
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#111', letterSpacing: 1.5, textTransform: 'uppercase', lineHeight: 1 }}>
                                {vehicle.plate || 'INCONNUE'}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Descriptif technique majeur */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ borderLeft: { xs: 'none', md: `1px solid ${theme.palette.divider}` }, pl: { xs: 0, md: 4 }, py: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'primary.main', lineHeight: 1.1 }}>
                                {brandName} {modelName}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
                                Année : {yearStr}
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                <Chip label={`Couleur : ${colorName}`} size="small" sx={{ borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', bgcolor: 'action.selected' }} />
                                <Chip label={`Statut : ${statusName}`} size="small" color="primary" sx={{ borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem' }} />
                            </Stack>
                        </Box>
                    </Grid>

                </Grid>
            </Paper>

            {/* 🟦 SECTION 2 : CONFIGURATION DU TABLEAU DE BORD (2 COLONNES EQUITABLES) */}
            <Grid container spacing={3}>

                {/* COLONNE 1 : FICHE TECHNIQUE COMPLÈTE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '6px', bgcolor: '#ffffff', height: '100%' }}>
                        <SectionHeader icon={mdiInformationOutline} title="Description du véhicule" />
                        <Stack spacing={0}>
                            <CondensedInfoLine label="Numéro d'immatriculation" value={vehicle.plate} bold />
                            <CondensedInfoLine label="Marque de commerce" value={brandName} />
                            <CondensedInfoLine label="Modèle de série" value={modelName} />
                            <CondensedInfoLine label="Année de fabrication" value={yearStr} />
                            <CondensedInfoLine label="Couleur extérieure" value={colorName} />
                            <CondensedInfoLine label="Statut opérationnel" value={statusName} />
                            <CondensedInfoLine label="Création du fichier" value={vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('fr-CA') : '---'} />
                        </Stack>
                    </Paper>
                </Grid>

                {/* COLONNE 2 : INDIVIDUS RELIÉS (GÉNÉRÉ PAR RECHERCHE INVERSÉE) */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '6px', bgcolor: '#ffffff', height: '100%' }}>
                        <SectionHeader icon={mdiAccountMultiple} title="Individus associés" />

                        <List disablePadding>
                            {vehicle.relatedPersons && vehicle.relatedPersons.length > 0 ? (
                                vehicle.relatedPersons.map((person: any, idx: number) => (
                                    <ListItemButton
                                        key={idx}
                                        component={Link}
                                        href={`/target/persons/${person._id}`}
                                        sx={{ p: 1, mb: 1, borderRadius: '4px', bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}
                                    >
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                            <Avatar
                                                src={person.photos?.find((p: any) => p.isMain)?.url || person.photos?.[0]?.url || undefined}
                                                sx={{ width: 36, height: 36, borderRadius: '4px' }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2 }}>
                                                    {person.lastname?.toUpperCase()}, {person.firstname}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                    Né(e) le : {person.birthDate ? new Date(person.birthDate).toLocaleDateString('fr-CA') : 'Inconnue'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={person.roleName}
                                                size="small"
                                                color={person.roleName.toLowerCase().includes('propriétaire') ? 'primary' : 'default'}
                                                sx={{ height: 20, fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '4px' }}
                                            />
                                        </Stack>
                                    </ListItemButton>
                                ))
                            ) : (
                                <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                        Aucun individu n'est rattaché à ce véhicule.
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                                        Les liens se créent automatiquement depuis la fiche d'un individu.
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Grid>

            </Grid>
        </Container>
    );
}

// --- SOUS-COMPOSANTS INTERNES ---

function CondensedInfoLine({ label, value, color = 'text.primary', bold = false, italic = false }: any) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>{label}</Typography>
            <Typography variant="body2" sx={{ color, fontWeight: bold ? 800 : 500, fontStyle: italic ? 'italic' : 'normal', textTransform: 'uppercase' }}>
                {value || '---'}
            </Typography>
        </Box>
    );
}

function SectionHeader({ icon, title }: any) {
    const theme = useTheme();
    return (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: theme.palette.primary.main + '15',
                color: theme.palette.primary.main,
                p: 0.8, borderRadius: 1.5
            }}>
                <Icon path={icon} size={0.8} color="currentColor" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {title}
            </Typography>
        </Stack>
    );
}