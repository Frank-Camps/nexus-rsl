'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { queryer } from '@/lib/services/axios';
import {
    Box, Typography, Container, Paper, Stack, Button,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Chip, Breadcrumbs, Link,
    TextField, useTheme, Popover, Badge, Divider
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import VehicleDialog from './_components/VehicleDialog';
import {IVehicle} from "@/interfaces/vehicle/vehicle";
import useSWRMutation from "swr/mutation";
import {saveVehicleAction} from "@/server/vehicle/saveVehicle"; // Ajuste le chemin si nécessaire

export default function CarsPage() {
    const theme = useTheme();
    const router = useRouter();

    // 🟢 ÉTAT POUR CONTRÔLER LE DIALOG
    const [openDialog, setOpenDialog] = useState(false);

    // 🔍 États pour chacun des critères de recherche
    const [searchCriteria, setSearchCriteria] = useState({
        plate: '',
        brand: '',
        model: '',
        year: '',
        color: ''
    });

    // 🎛️ État pour le menu déroulant (Popover) des filtres
    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Récupération des données depuis l'API
    const { data: vehicles, isLoading, error, mutate } = useSWR<IVehicle[]>('/api/vehicles', queryer);

    const { trigger: triggerSave } = useSWRMutation(
        '/api/vehicles',
        async (url, { arg }: { arg: any }) => {
            const res = await saveVehicleAction(arg);
            if (!res.success) throw new Error(res.error);
            return res;
        },
        {
            onSuccess: () => {
                setOpenDialog(false); // On ferme la fenêtre
                mutate(); // On rafraîchit la liste du tableau instantanément
            },
            onError: (error) => {
                console.error("❌ Erreur SWR:", error.message);
                alert(`Erreur lors de la sauvegarde: ${error.message}`);
            }
        }
    );

    // 🟢 La fonction déclenchée par le bouton Enregistrer du Dialog
    const handleSaveVehicle = async (data: any) => {
        try {
            await triggerSave(data);
        } catch (error) {
            console.error("Échec de l'envoi de la mutation:", error);
        }
    };

    // Fonctions de gestion du menu déroulant
    const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };
    const handleCloseFilters = () => {
        setFilterAnchorEl(null);
    };
    const openFilters = Boolean(filterAnchorEl);

    // Fonction pour gérer les changements dans les inputs
    const handleSearchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCriteria(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    // Réinitialiser tous les filtres
    const handleResetFilters = () => {
        setSearchCriteria({
            plate: '',
            brand: '',
            model: '',
            year: '',
            color: ''
        });
    };

    // Calcul du nombre de filtres actifs (pour le badge rouge)
    const activeFilterCount = Object.values(searchCriteria).filter(val => val !== '').length;

    // Filtrage en temps réel des véhicules
    const filteredVehicles = vehicles?.filter((vehicle: any) => {
        const matchPlate = !searchCriteria.plate || vehicle.plate?.toLowerCase().includes(searchCriteria.plate.toLowerCase());
        const matchBrand = !searchCriteria.brand || vehicle.brand?.name?.toLowerCase().includes(searchCriteria.brand.toLowerCase());
        const matchModel = !searchCriteria.model || vehicle.model?.name?.toLowerCase().includes(searchCriteria.model.toLowerCase());
        const matchYear = !searchCriteria.year || vehicle.year?.toLowerCase().includes(searchCriteria.year.toLowerCase());
        const matchColor = !searchCriteria.color || vehicle.color?.name?.toLowerCase().includes(searchCriteria.color.toLowerCase());

        return matchPlate && matchBrand && matchModel && matchYear && matchColor;
    });

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress size={60} />
        </Box>
    );

    if (error) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error">⚠️ Erreur de chargement des véhicules</Typography>
        </Box>
    );

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
            {/* FIL D'ARIANE */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'text.secondary', gap: 0.5, fontSize: '0.85rem' }} onClick={() => router.push('/')}>
                    <HomeIcon fontSize="inherit" /> Accueil
                </Link>
                <Typography sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
                    <DirectionsCarIcon fontSize="inherit" /> Véhicules d'Intérêt
                </Typography>
            </Breadcrumbs>

            {/* EN-TÊTE DE LA PAGE */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
                        Véhicules d&#39;intérêt
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Registre et recherche des fichiers véhicules liés aux dossiers
                    </Typography>
                </Box>

                {/* 🟦 BOUTONS D'ACTION (Nouveau Véhicule + Filtres) */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Badge badgeContent={activeFilterCount} color="error">
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            size="medium"
                            onClick={handleOpenFilters}
                            sx={{ fontWeight: 'bold', borderRadius: '6px', bgcolor: openFilters ? 'action.selected' : 'transparent' }}
                        >
                            Filtres
                        </Button>
                    </Badge>

                    {/* 🟢 ACTION SUR LE BOUTON */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="medium"
                        onClick={() => setOpenDialog(true)}
                        sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                    >
                        Nouveau Véhicule
                    </Button>
                </Stack>
            </Stack>

            {/* 🟦 MENU DÉROULANT DES FILTRES (Popover) */}
            <Popover
                open={openFilters}
                anchorEl={filterAnchorEl}
                onClose={handleCloseFilters}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    variant: 'outlined',
                    sx: { p: 2, width: 320, mt: 1, borderRadius: '6px', boxShadow: theme.shadows[4] }
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                            Critères de recherche
                        </Typography>
                        {activeFilterCount > 0 && (
                            <Button size="small" onClick={handleResetFilters} startIcon={<ClearIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
                                Effacer
                            </Button>
                        )}
                    </Stack>
                    <Divider />
                    <TextField
                        fullWidth
                        size="small"
                        label="Plaque"
                        variant="outlined"
                        value={searchCriteria.plate}
                        onChange={handleSearchChange('plate')}
                        slotProps={{ htmlInput: { style: { textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5 } } }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Marque"
                        variant="outlined"
                        value={searchCriteria.brand}
                        onChange={handleSearchChange('brand')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Modèle"
                        variant="outlined"
                        value={searchCriteria.model}
                        onChange={handleSearchChange('model')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Année"
                            variant="outlined"
                            value={searchCriteria.year}
                            onChange={handleSearchChange('year')}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="Couleur"
                            variant="outlined"
                            value={searchCriteria.color}
                            onChange={handleSearchChange('color')}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                        />
                    </Stack>
                </Stack>
            </Popover>

            {/* LISTE DES VÉHICULES TABLEAU */}
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '6px', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5 }}>Plaque</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5 }}>Marque</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5 }}>Modèle</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5 }}>Année</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5 }}>Couleur</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', py: 1.5, textAlign: 'right' }}>Statut</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredVehicles && filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle: any) => (
                                <TableRow
                                    key={vehicle._id}
                                    hover
                                    onClick={() => router.push(`/target/cars/${vehicle._id}`)}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: 900, fontSize: '1rem', letterSpacing: 0.5, py: 1.5, textTransform: 'uppercase' }}>
                                        {vehicle.plate || 'INCONNUE'}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', py: 1.5 }}>
                                        {vehicle.brand?.name || '---'}
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', py: 1.5 }}>
                                        {vehicle.model?.name || '---'}
                                    </TableCell>
                                    <TableCell sx={{ py: 1.5 }}>
                                        {vehicle.year || '---'}
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'uppercase', py: 1.5 }}>
                                        {vehicle.color?.name || '---'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1.5 }}>
                                        <Chip
                                            label={vehicle.carStatus?.name || 'Non défini'}
                                            size="small"
                                            sx={{ fontWeight: 'bold', borderRadius: '4px', fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                        Aucun véhicule ne correspond aux critères de recherche.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 🟢 INTÉGRATION DU DIALOG À LA FIN DU COMPOSANT */}
            <VehicleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSaveVehicle}
                // Tu pourras passer initialData ici si tu veux utiliser le même bouton pour "Modifier" plus tard
            />

        </Container>
    );
}