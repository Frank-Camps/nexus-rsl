'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stack, TextField, MenuItem, Typography,
    Box, Tabs, Tab, Paper, InputLabel, FormControl, Select,
    useTheme, Fade, IconButton, List, Avatar, ListItem,
    Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useSWR from 'swr';
import { queryer } from '@/lib/services/axios';
import Icon from '@mdi/react';
import {
    mdiCarConnected, mdiCheckCircleOutline, mdiClose,
    mdiCalendarRange, mdiPalette, mdiCounter, mdiAccountMultiple
} from '@mdi/js';
import { IVehicle } from '@/interfaces/vehicle/vehicle.interface';

// --- HELPERS STYLISÉS (Même look que PersonDialog) ---
const StyledTextField = (props: any) => (
    <TextField
        {...props}
        size="small"
        variant="outlined"
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                backgroundColor: '#ffffff',
            }
        }}
    />
);

const MetadataDropdown = ({ name, label, control, options }: any) => (
    <Controller
        name={name}
        control={control}
        render={({ field }) => (
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    {...field}
                    label={label}
                    value={field.value || ''}
                    sx={{ borderRadius: '6px', backgroundColor: '#ffffff' }}
                >
                    {options.map((opt: any) => (
                        <MenuItem key={opt._id || opt.id} value={opt._id || opt.id}>
                            {opt.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}
    />
);

interface VehicleDialogProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
    initialData?: any | null;
}

export default function VehicleDialog({ open, onClose, onSave, initialData }: VehicleDialogProps) {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);

    // Récupération des métadonnées et des modèles de voitures
    const { data: metadata = [] } = useSWR('/api/metadata', queryer);
    const { data: allModels = [] } = useSWR('/api/car-models', queryer); // Assure-toi d'avoir cette route

    const { control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: initialData || {}
    });

    // Surveillance de la marque pour filtrer les modèles
    const selectedBrandId = watch('brand');

    useEffect(() => {
        if (open) {
            setTabIndex(0);
            if (initialData) {
                const extractId = (field: any) => field?._id || field?.id || field || '';

                reset({
                    _id: initialData._id,
                    plate: initialData.plate || '',
                    year: initialData.year || '',
                    brand: extractId(initialData.brand),
                    model: extractId(initialData.model),
                    color: extractId(initialData.color),
                    carStatus: extractId(initialData.carStatus),
                    // Note: relatedPersons est géré par la recherche inversée,
                    // on l'affiche mais on ne le "sauvegarde" pas ici directement dans le doc Vehicle
                    relatedPersons: initialData.relatedPersons || []
                });
            } else {
                reset({ plate: '', year: '', brand: '', model: '', color: '', carStatus: '' });
            }
        }
    }, [open, initialData, reset]);

    const getOptions = (type: string) => metadata.filter((m: any) => m.type === type);

    // Filtrage dynamique des modèles selon la marque sélectionnée
    const filteredModels = allModels.filter((m: any) => m.brandId === selectedBrandId);

    const onSubmit = (data: any) => {
        if (onSave) onSave(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: '8px' } }}>
            <DialogTitle sx={{ p: 0, background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`, color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '8px', display: 'flex' }}>
                        <Icon path={mdiCarConnected} size={1.2} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{initialData ? 'Modifier Véhicule' : 'Nouveau Véhicule'}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>Gestion du parc automobile d'intérêt</Typography>
                    </Box>
                </Stack>
                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} textColor="inherit" variant="fullWidth" sx={{ bgcolor: 'rgba(0,0,0,0.1)', '& .MuiTabs-indicator': { backgroundColor: theme.palette.secondary.main, height: 4 } }}>
                    <Tab label="CARACTÉRISTIQUES" />
                    <Tab label="RELATIONS" />
                </Tabs>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: 400 }}>

                    {/* ONGLET 1 : TECHNIQUE */}
                    {tabIndex === 0 && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>Identification</Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Controller
                                            name="plate"
                                            control={control}
                                            render={({ field }) => (
                                                <StyledTextField
                                                    {...field}
                                                    label="Plaque d'immatriculation"
                                                    fullWidth
                                                    required
                                                    slotProps={{ htmlInput: { style: { textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1 } } }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Controller name="year" control={control} render={({ field }) => <StyledTextField {...field} label="Année" fullWidth />} />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>Spécifications</Typography>
                                <Stack spacing={2}>
                                    <MetadataDropdown name="brand" label="Marque" control={control} options={getOptions('car-brand')} />

                                    {/* Menu des modèles filtré par la marque */}
                                    <FormControl fullWidth size="small" disabled={!selectedBrandId}>
                                        <InputLabel>Modèle</InputLabel>
                                        <Controller
                                            name="model"
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} label="Modèle" sx={{ borderRadius: '6px', backgroundColor: '#ffffff' }}>
                                                    {filteredModels.map((m: any) => (
                                                        <MenuItem key={m.id || m._id} value={m.id || m._id}>{m.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </FormControl>

                                    <Stack direction="row" spacing={2}>
                                        <MetadataDropdown name="color" label="Couleur" control={control} options={getOptions('car-color')} />
                                        <MetadataDropdown name="carStatus" label="Statut" control={control} options={getOptions('car-status')} />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    {/* ONGLET 2 : RELATIONS */}
                    {tabIndex === 1 && (
                        <Stack spacing={2}>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>Individus reliés à ce véhicule</Typography>

                            {initialData?.relatedPersons && initialData.relatedPersons.length > 0 ? (
                                <List disablePadding>
                                    {initialData.relatedPersons.map((person: any, idx: number) => (
                                        <Paper key={idx} variant="outlined" sx={{ p: 1, mb: 1, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    src={person.photos?.find((p: any) => p.isMain)?.url || person.photos?.[0]?.url}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 45, borderRadius: '4px' }}
                                                />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {person.lastname?.toUpperCase()}, {person.firstname}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">{person.roleName}</Typography>
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px dashed #ccc' }}>
                                    <Icon path={mdiAccountMultiple} size={2} color="#ccc" />
                                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                                        Aucune relation active.
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        Les liens se créent via la fiche Individu.
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}

                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                    <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Annuler</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Icon path={mdiCheckCircleOutline} size={0.8}/>}
                        sx={{ px: 4, borderRadius: '6px', fontWeight: 'bold' }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}