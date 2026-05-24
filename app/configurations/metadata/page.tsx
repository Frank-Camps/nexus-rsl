'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Grid, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Paper, Button, Stack,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    useTheme, CircularProgress, IconButton, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Icon from '@mdi/react';
import { mdiFormatListBulleted, mdiDatabaseSettings, mdiPalette, mdiCar } from '@mdi/js';

// Types et Constantes
import { IMetadataItem } from "@/interfaces/properties/properties.interface";
import { METADATA_OPTIONS } from "./_constants/metadataOptions";
import MetadataTable from "./_components/MetadataTable";

// API Services
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { queryer, sendMutation, updateMutation, deleteMutation } from '../../../lib/services/axios';

export default function MetadataPage() {
    const theme = useTheme();

    // --- 1. LECTURE DES DONNÉES ---
    const { data: metadataList = [], mutate, isLoading } = useSWR('/api/metadata', queryer);
    const [selectedBrand, setSelectedBrand] = useState<IMetadataItem | null>(null);
    const { data: carModels = [], mutate: mutateModels, isLoading: isLoadingModels } = useSWR(
        selectedBrand ? `/api/car-models?brandId=${selectedBrand.id}` : null,
        queryer
    );

    // --- 2. MUTATIONS ---
    const { trigger: triggerPost } = useSWRMutation('/api/metadata', sendMutation);
    const { trigger: triggerPut } = useSWRMutation('/api/metadata', updateMutation);
    const { trigger: triggerDelete } = useSWRMutation('/api/metadata', deleteMutation);

    const { trigger: triggerModelPost } = useSWRMutation('/api/car-models', sendMutation);
    const { trigger: triggerModelPut } = useSWRMutation('/api/car-models', updateMutation);
    const { trigger: triggerModelDelete } = useSWRMutation('/api/car-models', deleteMutation);

    // --- 3. ÉTATS LOCAUX ---
    const [selectedType, setSelectedType] = useState<string>('');
    const [openNewSectionModal, setOpenNewSectionModal] = useState(false);
    const [newSectionKey, setNewSectionKey] = useState('');
    const [newSectionFirstItem, setNewSectionFirstItem] = useState('');

    const [openItemModal, setOpenItemModal] = useState(false);
    const [editingItem, setEditingItem] = useState<IMetadataItem | null>(null);
    const [itemName, setItemName] = useState('');

    // États pour Modèles (Véhicules)
    const [openModelModal, setOpenModelModal] = useState(false);
    const [editingModel, setEditingModel] = useState<any | null>(null);
    const [modelName, setModelName] = useState('');

    // --- 4. LOGIQUE DES CATÉGORIES ---
    const staticTypes = METADATA_OPTIONS.map(opt => opt.type);
    const existingTypes = metadataList.map((item: any) => item.type);
    const dynamicTypes = Array.from(new Set([...staticTypes, ...existingTypes])).sort();

    const filteredItems = metadataList.filter((item: any) => item.type === selectedType);

    useEffect(() => {
        if (dynamicTypes.length > 0 && !selectedType) {
            setSelectedType(dynamicTypes[0] as string);
        }
    }, [dynamicTypes, selectedType]);

    useEffect(() => {
        setSelectedBrand(null);
    }, [selectedType]);

    const getOptionDetails = (type: string) => {
        const found = METADATA_OPTIONS.find(opt => opt.type === type);
        if (found) return { label: found.label, icon: found.icon };
        const formattedLabel = type.replace(/-/g, ' ').replace(/(^\w)/, (match) => match.toUpperCase());
        let dynamicIcon = mdiFormatListBulleted;
        if (type.includes('car')) dynamicIcon = mdiCar;
        if (type.includes('color')) dynamicIcon = mdiPalette;
        return { label: formattedLabel, icon: dynamicIcon };
    };

    // --- 5. ACTIONS MÉTADONNÉES ---
    const handleSaveItem = async () => {
        if (!itemName.trim()) return;
        try {
            if (editingItem) {
                await triggerPut({ id: editingItem.id, name: itemName.trim(), type: selectedType });
            } else {
                await triggerPost({ type: selectedType, name: itemName.trim() });
            }
            setOpenItemModal(false);
            setItemName('');
            setEditingItem(null);
            mutate();
        } catch (e) { console.error(e); }
    };

    const handleDeleteItem = async (id: string) => {
        if (window.confirm("Supprimer cet élément ?")) {
            try {
                await triggerDelete({ id });
                if (selectedBrand?.id === id) setSelectedBrand(null);
                mutate();
            } catch (e) { console.error(e); }
        }
    };

    const handleCreateSection = async () => {
        if (!newSectionKey || !newSectionFirstItem) return;
        const formattedKey = newSectionKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, '-');
        try {
            await triggerPost({ type: formattedKey, name: newSectionFirstItem.trim() });
            setSelectedType(formattedKey);
            setNewSectionKey('');
            setNewSectionFirstItem('');
            setOpenNewSectionModal(false);
            mutate();
        } catch (e) { console.error(e); }
    };

    // --- 6. ACTIONS MODÈLES ---
    const handleOpenModelModal = (model: any = null) => {
        if (model) {
            setEditingModel(model);
            setModelName(model.name);
        } else {
            setEditingModel(null);
            setModelName('');
        }
        setOpenModelModal(true);
    };

    const handleSaveModel = async () => {
        if (!modelName.trim() || !selectedBrand) return;
        try {
            if (editingModel) {
                await triggerModelPut({ id: editingModel.id, name: modelName.trim() });
            } else {
                await triggerModelPost({ brandId: selectedBrand.id, name: modelName.trim() });
            }
            setOpenModelModal(false);
            setModelName('');
            setEditingModel(null);
            mutateModels();
        } catch (e) { console.error(e); }
    };

    const handleDeleteModel = async (id: string) => {
        if (window.confirm("Supprimer ce modèle ?")) {
            try {
                await triggerModelDelete({ id });
                mutateModels();
            } catch (e) { console.error(e); }
        }
    };

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
    );

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, width: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ display: 'flex', p: 1.5, borderRadius: 1, backgroundColor: theme.palette.primary.main, color: 'white' }}>
                        <Icon path={mdiDatabaseSettings} size={1.4} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestion des Métadonnées</Typography>
                </Stack>
                <Button variant="outlined" startIcon={<CreateNewFolderIcon />} onClick={() => setOpenNewSectionModal(true)}
                        sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}>
                    Nouvelle Section
                </Button>
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                        <List disablePadding>
                            {dynamicTypes.map((type) => (
                                <ListItem key={type as string} disablePadding divider>
                                    <ListItemButton selected={selectedType === type} onClick={() => setSelectedType(type as string)}>
                                        <ListItemIcon sx={{ minWidth: 40, color: selectedType === type ? theme.palette.primary.main : 'inherit' }}>
                                            <Icon path={getOptionDetails(type as string).icon} size={0.9} />
                                        </ListItemIcon>
                                        <ListItemText primary={getOptionDetails(type as string).label} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
                        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, flex: 1, width: '100%' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{getOptionDetails(selectedType).label}</Typography>
                                <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingItem(null); setItemName(''); setOpenItemModal(true); }}>
                                    Ajouter
                                </Button>
                            </Stack>
                            <MetadataTable
                                items={filteredItems}
                                onEdit={(item) => { setEditingItem(item); setItemName(item.name); setOpenItemModal(true); }}
                                onDelete={handleDeleteItem}
                                onRowClick={(item) => selectedType === 'car-brand' && setSelectedBrand(item)}
                                selectedId={selectedBrand?.id}
                            />
                        </Paper>

                        {selectedType === 'car-brand' && selectedBrand && (
                            <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.primary.main}`, flex: 1, width: '100%', animation: 'fadeIn 0.3s' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                            Modèles : {selectedBrand.name}
                                        </Typography>
                                    </Box>
                                    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModelModal()}>
                                        Modèle
                                    </Button>
                                </Stack>
                                <Divider sx={{ mb: 1 }} />
                                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    {isLoadingModels ? <CircularProgress size={20} /> : carModels.map((model: any) => (
                                        <ListItem key={model.id} secondaryAction={
                                            <Stack direction="row" spacing={1}>
                                                <IconButton edge="end" onClick={() => handleOpenModelModal(model)} color="primary" size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton edge="end" onClick={() => handleDeleteModel(model.id)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        }>
                                            <ListItemText primary={model.name} />
                                        </ListItem>
                                    ))}
                                    {carModels.length === 0 && !isLoadingModels && <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>Aucun modèle</Typography>}
                                </List>
                            </Paper>
                        )}
                    </Stack>
                </Grid>
            </Grid>

            {/* Modal Item (Metadata) */}
            <Dialog open={openItemModal} onClose={() => setOpenItemModal(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingItem ? 'Modifier' : 'Ajouter'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nom" fullWidth value={itemName} onChange={e => setItemName(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenItemModal(false)}>Annuler</Button>
                    <Button onClick={handleSaveItem} variant="contained">Sauvegarder</Button>
                </DialogActions>
            </Dialog>

            {/* Modal Modèle (Véhicule) */}
            <Dialog open={openModelModal} onClose={() => setOpenModelModal(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editingModel ? 'Modifier le modèle' : `Nouveau modèle pour ${selectedBrand?.name}`}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nom du modèle" fullWidth value={modelName} onChange={e => setModelName(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModelModal(false)}>Annuler</Button>
                    <Button onClick={handleSaveModel} variant="contained" color="primary">
                        {editingModel ? 'Mettre à jour' : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Section */}
            <Dialog open={openNewSectionModal} onClose={() => setOpenNewSectionModal(false)}>
                <DialogTitle>Nouvelle section</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 350 }}>
                        <TextField label="Nom de la section" fullWidth value={newSectionKey} onChange={e => setNewSectionKey(e.target.value)} />
                        <TextField label="Premier élément" fullWidth value={newSectionFirstItem} onChange={e => setNewSectionFirstItem(e.target.value)} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewSectionModal(false)}>Annuler</Button>
                    <Button onClick={handleCreateSection} variant="contained">Créer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}