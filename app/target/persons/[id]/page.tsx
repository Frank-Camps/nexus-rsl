'use client';

import React, {use, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { queryer } from '../../../../lib/services/axios';
import {
    Box, Paper, Typography, Stack, Avatar, Chip,
    Divider, Button, CircularProgress, Breadcrumbs, Link,
    useTheme, Container, List, ListItem, ListItemButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Icon from '@mdi/react';
import {mdiMapMarker, mdiHumanGreeting, mdiEye, mdiIdentifier, mdiShieldAccount, mdiCar, mdiFileDocumentOutline} from '@mdi/js';
import PersonDialog from "@/app/target/persons/_components/PersonDialog";
import useSWRMutation from "swr/mutation";
import {IPerson} from "../../../../interfaces/person/person.interface";
import {savePersonAction} from "@/server/persons/savePerson";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PersonDetailsPage({ params }: PageProps) {
    const theme = useTheme();
    const router = useRouter();
    const { id } = use(params);
    const [openDialog, setOpenDialog] = useState(false);

    const { data: person, isLoading, error, mutate } = useSWR(id ? `/api/persons/${id}` : null, queryer);
    const { data: metadata = [] } = useSWR('/api/metadata', queryer);

    const { trigger: triggerSave } = useSWRMutation(
        id ? `/api/persons/${id}` : null,
        async (url, { arg }: { arg: IPerson }) => {
            const res = await savePersonAction(arg);
            if (!res.success) throw new Error(res.error);
            return res;
        },
        {
            onSuccess: () => {
                setOpenDialog(false);
            },
            onError: (error) => {
                console.error("❌ Erreur SWR:", error.message);
                alert(`Erreur: ${error.message}`);
            }
        }
    );

    const handleSavePerson = async (data: IPerson) => {
        try {
            const payload = { ...data, _id: person._id };
            await triggerSave(payload);
        } catch (error: unknown) {
            console.error("Erreur inattendue:", error instanceof Error ? error.message : error);
        }
    };


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
        <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 } }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
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

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
                        Fiche Individuelle
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mise à jour : {new Date(person.updatedAt).toLocaleString()}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<PrintIcon />} size="small">Imprimer</Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => setOpenDialog(true)}
                    >
                        Modifier
                    </Button>
                </Stack>
            </Stack>

            {/* 🟦 SECTION 1 : L'EN-TÊTE CONDENSÉ (HERO) */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3, bgcolor: '#ffffff' }}>
                <Grid container spacing={4} alignItems="center">

                    {/* Colonne 1 : Infos Système (À gauche) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>Identification Système</Typography>
                        <Stack spacing={0}>
                            <CondensedInfoLine label="Permis de conduire" value={person.diverLicence} />
                            <CondensedInfoLine label="Numéro de Référence (FPS)" value={person.fps} color="error.main" bold />
                            <CondensedInfoLine label="Surnom / Alias" value={person.nickname} italic />
                            <CondensedInfoLine label="Téléphone" value={person.phone} />
                            <CondensedInfoLine label="Courriel" value={person.email} />
                        </Stack>
                    </Grid>

                    {/* Colonne 2 : Identité Principale (Au Centre) */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ borderLeft: `1px solid ${theme.palette.divider}`, pl: { xs: 0, md: 4 }, py: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'primary.main', lineHeight: 1.1 }}>
                                {person.lastname},
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                                {person.firstname}
                            </Typography>

                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Icon path={mdiShieldAccount} size={0.8} />
                                {person.birthDate ? new Date(person.birthDate).toLocaleDateString('fr-CA') : 'Date de naissance inconnue'}
                            </Typography>

                            <Stack direction="row" spacing={3}>
                                <DetailField label="Sexe" value={person.sex?.name} />
                                <DetailField label="Origine (Race)" value={person.origin?.name} />
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Colonne 3 : La Photo Principale (À Droite) */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                        <Box sx={{ position: 'relative', width: 220, height: 260 }}>
                            <Avatar
                                src={person.photos?.find((p: any) => p.isMain)?.url || person.photos?.[0]?.url || undefined}
                                variant="rounded"
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[2] }}
                            />
                            {person.wanted && (
                                <Chip icon={<WarningAmberIcon style={{ color: 'white' }} />} label="RECHERCHÉ" color="error" sx={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', px: 1, boxShadow: 2 }} />
                            )}
                        </Box>
                    </Grid>

                </Grid>
            </Paper>

            {/* 🟦 SECTION 2 : LA GRILLE CONDENSÉE (3 COLONNES) */}
            <Grid container spacing={3}>

                {/* COLONNE 1 : PHYSIQUE ET MARQUES */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff' }}>
                            <SectionHeader icon={mdiEye} title="Signalement & Marques" />

                            <Stack spacing={0} sx={{ mb: 3 }}>
                                <CondensedInfoLine label="Couleur des yeux" value={person.eyeColor?.name} />
                                <CondensedInfoLine label="Couleur des cheveux" value={person.hairColor?.name} />
                                <CondensedInfoLine label="Type de cheveux" value={person.hairType?.name} />
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {['tattoo', 'scars', 'piercings'].map((cat) => (
                                <Box key={cat} sx={{ mb: 2 }}>
                                    <Typography variant="overline" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'block', mb: 0.5, lineHeight: 1 }}>{cat}s</Typography>
                                    {person[cat] && person[cat].length > 0 ? person[cat].map((item: any, idx: number) => {
                                        const regionObj = metadata.find((m: any) => m._id === item.region || m.id === item.region);
                                        const regionName = regionObj ? regionObj.name : 'Région inconnue';
                                        return (
                                            <Box key={idx} sx={{ p: 1, mb: 0.5, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `3px solid ${theme.palette.primary.main}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 800 }}>{regionName}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                                            </Box>
                                        );
                                    }) : (
                                        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>Aucun identifiant</Typography>
                                    )}
                                </Box>
                            ))}
                        </Paper>
                    </Stack>
                </Grid>

                {/* COLONNE 2 : PROFIL D'INTÉRÊT ET NOTES */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff' }}>
                            <SectionHeader icon={mdiHumanGreeting} title="Profil Criminel" />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5, lineHeight: 1 }}>CONDITIONS / ORDONNANCES</Typography>
                                <Stack spacing={0}>
                                    {person.conditions && person.conditions.length > 0 ? person.conditions.map((id: string, idx: number) => (
                                        <Box key={idx} sx={{ p: 1, mb: 0.5, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `3px solid ${theme.palette.error.main}`, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                                {metadata.find((m: any) => m._id === id || m.id === id)?.name || 'Inconnue'}
                                            </Typography>
                                        </Box>
                                    )) : <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>Aucune condition</Typography>}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5, lineHeight: 1 }}>SECTEURS D'ACTIVITÉ</Typography>
                                <Stack spacing={0}>
                                    {person.activitySector && person.activitySector.length > 0 ? person.activitySector.map((id: string, idx: number) => (
                                        <Box key={idx} sx={{ p: 1, mb: 0.5, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `3px solid ${theme.palette.warning.main}`, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                                {metadata.find((m: any) => m._id === id || m.id === id)?.name || 'Inconnu'}
                                            </Typography>
                                        </Box>
                                    )) : <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>Aucun secteur défini</Typography>}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5, lineHeight: 1 }}>TYPE D'ACTIVITÉS</Typography>
                                <Stack spacing={0}>
                                    {person.activities && person.activities.length > 0 ? person.activities.map((id: string, idx: number) => (
                                        <Box key={idx} sx={{ p: 1, mb: 0.5, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `3px solid ${theme.palette.grey[400]}`, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                                {metadata.find((m: any) => m._id === id || m.id === id)?.name || 'Inconnue'}
                                            </Typography>
                                        </Box>
                                    )) : <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>Aucune activité</Typography>}
                                </Stack>
                            </Box>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: '#fafafa' }}>
                            <SectionHeader icon={mdiFileDocumentOutline} title="Notes & Observations" />
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, color: person.notes ? 'text.primary' : 'text.disabled', fontStyle: person.notes ? 'normal' : 'italic' }}>
                                {person.notes || "Aucune note consignée au dossier."}
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>

                {/* COLONNE 3 : RELATIONS (HUMAINS & VÉHICULES) */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff' }}>
                            <SectionHeader icon={mdiHumanGreeting} title="Réseau & Complices" />
                            <List disablePadding>
                                {person.personRelations && person.personRelations.length > 0 ? (
                                    person.personRelations.map((rel: any, idx: number) => {
                                        const relatedPerson = rel.person;
                                        if (!relatedPerson || typeof relatedPerson === 'string') return null;

                                        const roleName = metadata.find((m: any) => m._id === rel.role || m.id === rel.role)?.name || 'Relation';
                                        return (
                                            <ListItemButton key={idx} component={Link} href={`/target/persons/${relatedPerson._id}`} sx={{ p: 1, mb: 1, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                                    <Avatar src={relatedPerson.photos?.find((p: any) => p.isMain)?.url || relatedPerson.photos?.[0]?.url || undefined} sx={{ width: 36, height: 36, borderRadius: 1 }} />
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2 }}>{relatedPerson.lastname?.toUpperCase()}, {relatedPerson.firstname}</Typography>
                                                    </Box>
                                                    <Chip label={roleName} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 'bold' }} color={roleName === 'SUS' ? 'error' : 'default'} />
                                                </Stack>
                                            </ListItemButton>
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.disabled">Aucun individu relié.</Typography>
                                )}
                            </List>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: '#ffffff' }}>
                            <SectionHeader icon={mdiCar} title="Véhicules associés" />
                            <List disablePadding>
                                {person.vehicleRelations && person.vehicleRelations.length > 0 ? (
                                    person.vehicleRelations.map((rel: any, idx: number) => {
                                        const vehicle = rel.vehicle;
                                        if (!vehicle || typeof vehicle === 'string') return null;

                                        const roleName = metadata.find((m: any) => m._id === rel.role || m.id === rel.role)?.name || 'Relation';
                                        const brandName = vehicle.brand?.name || 'Inconnue';
                                        const modelName = vehicle.model?.name || '';

                                        return (
                                            <ListItemButton key={idx} component={Link} href={`/target/vehicles/${vehicle._id}`} sx={{ p: 1, mb: 1, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                                    <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: 'grey.200', color: 'grey.600' }}><Icon path={mdiCar} size={0.8} /></Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2 }}>{vehicle.plate}</Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{brandName} {modelName}</Typography>
                                                    </Box>
                                                    <Chip label={roleName} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 'bold' }} />
                                                </Stack>
                                            </ListItemButton>
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.disabled">Aucun véhicule relié.</Typography>
                                )}
                            </List>
                        </Paper>
                    </Stack>
                </Grid>

            </Grid>

            <PersonDialog
                open={openDialog}
                initialData={person}
                onClose={() => setOpenDialog(false)}
                onSave={handleSavePerson}
            />
        </Container>
    );
}

// --- SOUS-COMPOSANTS REVISITÉS POUR SAUVER DE L'ESPACE ---

function CondensedInfoLine({ label, value, color = 'text.primary', bold = false, italic = false, chip = false }: any) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>{label}</Typography>
            {chip && value ? (
                <Chip label={value} size="small" variant="outlined" color="primary" sx={{ height: 22, fontWeight: 'bold', fontSize: '0.7rem' }} />
            ) : (
                <Typography variant="body2" sx={{ color, fontWeight: bold ? 800 : 500, fontStyle: italic ? 'italic' : 'normal' }}>
                    {value || '---'}
                </Typography>
            )}
        </Box>
    );
}

function DetailField({ label, value }: any) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || '---'}</Typography>
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