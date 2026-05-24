'use client';

import React, {use, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { queryer } from '@/lib/axios';
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
import {mdiMapMarker, mdiHumanGreeting, mdiEye, mdiIdentifier, mdiShieldAccount, mdiCar} from '@mdi/js';
import PersonDialog from "@/app/target/persons/_components/PersonDialog";
import useSWRMutation from "swr/mutation";
import {IPerson} from "@/interfaces/person/person";
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
        id ? `/api/persons/${id}` : null, // <-- Clé spécifique à cet individu
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
                alert(`Erreur: ${error.message}`); // À remplacer par un Toast/Snackbar plus tard
            }
        }
    );

    const handleSavePerson = async (data: IPerson) => {
        try {
            // On s'assure d'inclure l'ID du sujet qu'on regarde actuellement
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
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        size="large"
                        sx={{ fontWeight: 'bold' }}
                        onClick={() => setOpenDialog(true)}
                    >
                        Modifier
                    </Button>
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
                                <Grid size={{ xs: 12, sm: 4 }}><DetailField label="Race" value={person.origin?.name} /></Grid>
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
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiIdentifier} title="Marques Distinctives & Tattoos" />
                            <Grid container spacing={3}>
                                {['tattoo', 'scars', 'piercings'].map((cat) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={cat}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, textTransform: 'uppercase', color: 'primary.main', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                            {cat}s
                                        </Typography>

                                        {person[cat] && person[cat].length > 0 ? person[cat].map((item: any, idx: number) => {

                                            // 🔍 On cherche la correspondance dans les métadonnées
                                            const regionObj = metadata.find((m: any) => m._id === item.region || m.id === item.region);
                                            const regionName = regionObj ? regionObj.name : 'Région inconnue';

                                            return (
                                                <Box key={idx} sx={{ p: 1.5, mb: 1, bgcolor: 'action.hover', borderRadius: 1, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                                                    {/* Affichage de la région (ex: Bras droit) */}
                                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                        {regionName}
                                                    </Typography>

                                                    {/* Affichage de la description (ex: Devil Riders) */}
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {item.description}
                                                    </Typography>
                                                </Box>
                                            );
                                        }) : (
                                            <Typography variant="caption" color="text.disabled">Aucune donnée</Typography>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiHumanGreeting} title="Profil d'intérêt" />
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, fontWeight: 'bold' }}>
                                            Condition en vigueur:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {person.conditions && person.conditions.length > 0 ? (
                                                person.conditions.map((conditionId: string, idx: number) => {
                                                    // 🔍 On cherche la correspondance dans les métadonnées
                                                    const activityObj = metadata.find((m: any) => m._id === conditionId || m.id === conditionId);
                                                    const activityName = activityObj ? activityObj.name : 'Aucune Condition';

                                                    return (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                p: 1.5,
                                                                bgcolor: 'action.hover',
                                                                borderRadius: 1,
                                                                borderLeft: `4px solid ${theme.palette.primary.main}`
                                                            }}
                                                        >
                                                            <Chip
                                                                label={activityName}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    bgcolor: theme.palette.primary.main + '15', // Fond transparent
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        </Box>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>---</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, fontWeight: 'bold' }}>
                                            Secteurs
                                        </Typography>

                                        {/* Le conteneur Flexbox invisible qui gère l'alignement */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                            {person.activitySector && person.activitySector.length > 0 ? (
                                                person.activitySector.map((sectorId: string, idx: number) => {
                                                    // 🔍 On cherche le nom du secteur dans les métadonnées
                                                    const sectorObj = metadata.find((m: any) => m._id === sectorId || m.id === sectorId);
                                                    const sectorName = sectorObj ? sectorObj.name : 'Secteur inconnu';

                                                    return (
                                                        // La boîte individuelle générée pour chaque secteur
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                p: 1.5,
                                                                bgcolor: 'action.hover',
                                                                borderRadius: 1,
                                                                borderLeft: `4px solid ${theme.palette.primary.main}`
                                                            }}
                                                        >
                                                            <Chip
                                                                label={sectorName}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    bgcolor: theme.palette.primary.main + '15', // Fond transparent aux couleurs du thème
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        </Box>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>---</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, fontWeight: 'bold' }}>
                                            Relié
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {person.activities && person.activities.length > 0 ? (
                                                person.activities.map((activityId: string, idx: number) => {
                                                    // 🔍 On cherche la correspondance dans les métadonnées
                                                    const activityObj = metadata.find((m: any) => m._id === activityId || m.id === activityId);
                                                    const activityName = activityObj ? activityObj.name : 'Activité inconnue';

                                                    return (
                                                        <Box
                                                            key={idx}
                                                            sx={{
                                                                p: 1.5,
                                                                bgcolor: 'action.hover',
                                                                borderRadius: 1,
                                                                borderLeft: `4px solid ${theme.palette.primary.main}`
                                                            }}
                                                        >
                                                            <Chip
                                                                label={activityName}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    bgcolor: theme.palette.primary.main + '15', // Fond transparent
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        </Box>
                                                    );
                                                })
                                            ) : (
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>---</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                            <SectionHeader icon={mdiHumanGreeting} title="Relations" />

                            {/* 👥 LISTE DES INDIVIDUS RELIÉS */}
                            <List disablePadding sx={{ mt: 2 }}>
                                {person.personRelations && person.personRelations.length > 0 ? (
                                    person.personRelations.map((rel: any, idx: number) => {
                                        const relatedPerson = rel.person;

                                        if (!relatedPerson) {
                                            return (
                                                <ListItem key={idx} disablePadding sx={{ mb: 1.5 }}>
                                                    <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                                                        ⚠️ Individu lié introuvable (donnée supprimée ou corrompue).
                                                    </Typography>
                                                </ListItem>
                                            );
                                        }

                                        // Sécurité : Si le back-end n'a pas encore peuplé l'objet et renvoie juste une string (l'ID)
                                        if (typeof relatedPerson === 'string') {
                                            return (
                                                <Typography key={idx} variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                                                    Lien non peuplé (ID : {relatedPerson})
                                                </Typography>
                                            );
                                        }

                                        // 🔍 On cherche la correspondance du rôle dans les métadonnées (ex: SUS, Témoin, Complice)
                                        const roleObj = metadata.find((m: any) => m._id === rel.role || m.id === rel.role);
                                        const roleName = roleObj ? roleObj.name : 'Relation';

                                        // 📅 Formatage propre de la date de naissance du sujet lié
                                        let formattedBirthDate = 'Inconnue';
                                        if (relatedPerson.birthDate) {
                                            const dateObj = new Date(relatedPerson.birthDate);
                                            if (!isNaN(dateObj.getTime())) {
                                                formattedBirthDate = dateObj.toISOString().split('T')[0];
                                            }
                                        }

                                        return (
                                            <ListItem
                                                key={idx}
                                                disablePadding
                                                sx={{
                                                    mb: 1.5,
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    transition: '0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'action.selected',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                            >
                                                {/* Le bouton devient un vrai lien Next.js vers la fiche de la personne liée */}
                                                <ListItemButton
                                                    component={Link}
                                                    href={`/target/persons/${relatedPerson._id}`}
                                                    sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                                >
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        {/* Miniature de la photo de la personne reliée */}
                                                        <Avatar
                                                            src={relatedPerson.filesRelated?.[0]}
                                                            variant="rounded"
                                                            sx={{
                                                                width: 45,
                                                                height: 55,
                                                                borderRadius: '6px',
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                            }}
                                                        />
                                                        <Box>
                                                            {/* NOM en majuscules et Prénom */}
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                                                {relatedPerson.lastname?.toUpperCase()}, {relatedPerson.firstname}
                                                            </Typography>
                                                            {/* Date de naissance */}
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                Né(e) le : {formattedBirthDate}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    {/* Badge du rôle (Statut de la relation) */}
                                                    {rel.role && (
                                                        <Chip
                                                            label={roleName}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 800,
                                                                fontSize: '0.65rem',
                                                                borderRadius: 1,
                                                                bgcolor: roleName === 'SUS' ? 'error.main' : theme.palette.primary.main + '15',
                                                                color: roleName === 'SUS' ? 'white' : 'primary.main',
                                                            }}
                                                        />
                                                    )}
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                                        Aucun individu relié à ce dossier.
                                    </Typography>
                                )}
                            </List>
                        </Paper>

                        {/* 🚗 VÉHICULES ASSOCIÉS */}
                        <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none', mt: 3 }}>
                            <SectionHeader icon={mdiCar} title="Véhicules" />

                            <List disablePadding sx={{ mt: 2 }}>
                                {person.vehicleRelations && person.vehicleRelations.length > 0 ? (
                                    person.vehicleRelations.map((rel: any, idx: number) => {
                                        const relatedVehicle = rel.vehicle;

                                        // Sécurité 1 : Véhicule supprimé de la BD
                                        if (!relatedVehicle) {
                                            return (
                                                <ListItem key={idx} disablePadding sx={{ mb: 1.5 }}>
                                                    <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                                                        ⚠️ Véhicule lié introuvable (donnée supprimée ou corrompue).
                                                    </Typography>
                                                </ListItem>
                                            );
                                        }

                                        // Sécurité 2 : Le back-end n'a pas fait son .populate()
                                        if (typeof relatedVehicle === 'string') {
                                            return (
                                                <Typography key={idx} variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                                                    Lien non peuplé (ID : {relatedVehicle})
                                                </Typography>
                                            );
                                        }

                                        // 🔍 On cherche la correspondance du rôle dans les métadonnées (ex: Propriétaire, Conducteur)
                                        const roleObj = metadata.find((m: any) => m._id === rel.role || m.id === rel.role);
                                        const roleName = roleObj ? roleObj.name : 'Relation';

                                        const brandName = relatedVehicle.brand?.name || 'Marque inconnue';
                                        const modelName = relatedVehicle.model?.name || 'Modèle inconnu';
                                        const colorName = relatedVehicle.color?.name || '';
                                        const yearStr = relatedVehicle.year ? relatedVehicle.year : 'Année inconnue';

                                        return (
                                            <ListItem
                                                key={idx}
                                                disablePadding
                                                sx={{
                                                    mb: 1.5,
                                                    bgcolor: 'action.hover',
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    transition: '0.2s',
                                                    '&:hover': {
                                                        bgcolor: 'action.selected',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    component={Link}
                                                    href={`/target/vehicles/${relatedVehicle._id}`}
                                                    sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                                >
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                width: 45,
                                                                height: 55,
                                                                borderRadius: '6px',
                                                                bgcolor: 'background.paper',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                color: 'text.secondary'
                                                            }}
                                                        >
                                                            <Icon path={mdiCar} size={1.2} />
                                                        </Avatar>
                                                        <Box>
                                                            {/* TITRE PRINCIPAL : MARQUE, MODÈLE, ANNÉE, COULEUR */}
                                                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase' }}>
                                                                {brandName} {modelName} {yearStr} {colorName && `- ${colorName}`}
                                                            </Typography>

                                                            {/* SOUS-TITRE : PLAQUE D'IMMATRICULATION */}
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.75rem' }}>
                                                                Plaque : <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary', letterSpacing: 1 }}>{relatedVehicle.plate || 'INCONNUE'}</Box>
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    {rel.role && (
                                                        <Chip
                                                            label={roleName}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 800,
                                                                fontSize: '0.65rem',
                                                                borderRadius: 1,
                                                                bgcolor: theme.palette.primary.main + '15',
                                                                color: 'primary.main',
                                                            }}
                                                        />
                                                    )}
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })
                                ) : (
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                                        Aucun véhicule relié à ce dossier.
                                    </Typography>
                                )}
                            </List>
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

            <PersonDialog
                open={openDialog}
                initialData={person}
                onClose={() => setOpenDialog(false)}
                onSave={handleSavePerson}
            />
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