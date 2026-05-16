'use client';

import React, { use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { queryer } from '@/lib/axios';
import {
    Box, Paper, Typography, Stack, Avatar, Chip,
    Divider, Button, CircularProgress, Breadcrumbs, Link,
    useTheme, Container
} from '@mui/material';
// Selon ta version, Grid est maintenant Grid2 par défaut
import Grid from '@mui/material/Grid';

// Icons
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Icon from '@mdi/react';
import { mdiMapMarker, mdiHumanGreeting, mdiEye, mdiIdentifier, mdiShieldAccount } from '@mdi/js';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PersonDetailsPage({ params }: PageProps) {
    const theme = useTheme();
    const router = useRouter();
    const { id } = use(params);

    const { data: person, isLoading, error } = useSWR(id ? `/api/persons/${id}` : null, queryer);

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress size={60} />
        </Box>
    );

    if (error || !person) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>⚠️ Erreur de chargement</Typography>
            <Typography sx={{ mb: 3 }}>Le sujet est introuvable.</Typography>
            <Button variant="contained" onClick={() => router.push('/target/persons')}>
                Retour à la liste
            </Button>
        </Box>
    );

    return (
        <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 } }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 4 }}>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', gap: 0.5 }} onClick={() => router.push('/')}>
                    <HomeIcon fontSize="inherit" /> Accueil
                </Link>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', gap: 0.5 }} onClick={() => router.push('/target/persons')}>
                    <PersonIcon fontSize="inherit" /> Individus d'Intérêt
                </Link>
                <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {person.lastname} {person.firstname}
                </Typography>
            </Breadcrumbs>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
                        Fiche Individuelle
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Dernière mise à jour : {new Date(person.updatedAt).toLocaleString()}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<PrintIcon />} size="large">Imprimer</Button>
                    <Button variant="contained" startIcon={<EditIcon />} size="large" sx={{ fontWeight: 'bold' }}>Modifier</Button>
                </Stack>
            </Stack>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                        <Box sx={{ position: 'relative', mb: 3 }}>
                            <Avatar src={person.filesRelated?.[0]} variant="rounded" sx={{ width: '100%', height: 450, borderRadius: 2, border: `4px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[3] }} />
                            {person.wanted && (
                                <Chip icon={<WarningAmberIcon style={{ color: 'white' }} />} label="RECHERCHÉ" color="error" sx={{ position: 'absolute', top: 15, right: 15, fontWeight: 'bold', px: 1 }} />
                            )}
                        </Box>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Identité du Sujet</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>{person.lastname}</Typography>
                                <Typography variant="h5" color="primary">{person.firstname}</Typography>
                            </Box>
                            <Divider />
                            <InfoLine label="Numéro FPS" value={person.fps} color="error.main" bold />
                            <InfoLine label="Surnom / Alias" value={person.nickname} italic />
                            <InfoLine label="Statut National" value={person.personStatus?.name} chip />
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiShieldAccount} title="Identification & État Civil" />
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Date de naissance" value={person.birthDate ? new Date(person.birthDate).toLocaleDateString('fr-CA') : 'Inconnue'} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Lieu d'origine" value={person.origin?.name} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Sexe" value={person.sex?.name} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Permis de conduire" value={person.diverLicence} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Téléphone" value={person.phone} /></Grid>
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Courriel" value={person.email} /></Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiEye} title="Signalement Physique" />
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 6, sm: 3 }}><DetailField label="Yeux" value={person.eyeColor?.name} /></Grid>
                                <Grid size={{ xs: 6, sm: 3 }}><DetailField label="Cheveux (Couleur)" value={person.hairColor?.name} /></Grid>
                                <Grid size={{ xs: 6, sm: 3 }}><DetailField label="Cheveux (Type)" value={person.hairType?.name} /></Grid>
                                <Grid size={{ xs: 6, sm: 3 }}><DetailField label="Secteur d'activité" value={person.activitySector?.name} /></Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiIdentifier} title="Marques Distinctives & Tattoos" />
                            <Grid container spacing={3}>
                                {['tattoo', 'scars', 'piercings'].map((cat) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={cat}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, textTransform: 'uppercase', color: 'primary.main', fontSize: '0.75rem', fontWeight: 'bold' }}>{cat}s</Typography>
                                        {person[cat] && person[cat].length > 0 ? person[cat].map((item: any, idx: number) => (
                                            <Box key={idx} sx={{ p: 1.5, mb: 1, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                                                <Typography variant="body2">{item.description}</Typography>
                                            </Box>
                                        )) : <Typography variant="caption" color="text.disabled">Aucune donnée</Typography>}
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'grey.50', backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiHumanGreeting} title="Notes & Observations" />
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: person.notes ? 'text.primary' : 'text.disabled' }}>
                                {person.notes || "Aucune note consignée au dossier."}
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

// --- SOUS-COMPOSANTS ---

function InfoLine({ label, value, color = 'text.primary', bold = false, italic = false, chip = false }: any) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{label}</Typography>
            {chip && value ? <Chip label={value} size="small" variant="contained" color="primary" sx={{ display: 'block', mt: 0.5, fontWeight: 'bold', width: 'fit-content' }} /> :
                <Typography variant="body1" sx={{ color, fontWeight: bold ? 900 : 500, fontStyle: italic ? 'italic' : 'normal' }}>{value || '---'}</Typography>}
        </Box>
    );
}

function SectionHeader({ icon, title }: any) {
    const theme = useTheme();
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{
                // LE FIX EST ICI : On s'assure que le Box a des dimensions et que l'icône est forcée à s'afficher
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.primary.main + '15', // Couleur transparente
                color: theme.palette.primary.main,
                p: 1,
                borderRadius: 1.5,
                minWidth: 40,
                minHeight: 40
            }}>
                <Icon path={icon} size={1} color="currentColor" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                {title}
            </Typography>
        </Stack>
    );
}

function DetailField({ label, value }: any) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, fontWeight: 'bold' }}>{label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>{value || '---'}</Typography>
        </Box>
    );
}