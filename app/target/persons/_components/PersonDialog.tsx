'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Stack, TextField, MenuItem, Typography,
    Divider, FormControlLabel, Switch, Box, Avatar, IconButton,
    Tabs, Tab, Paper, Chip, Select, InputLabel, FormControl, OutlinedInput,
    useTheme, Fade
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import useSWR from 'swr';
import { queryer } from '@/lib/axios';
import Icon from '@mdi/react';
import {
    mdiAccountPlus, mdiCamera, mdiClose, mdiPlus, mdiDelete,
    mdiCheckCircleOutline, mdiLinkVariant, mdiIdentifier
} from '@mdi/js';
import {IPerson} from "@/interfaces/person/person";

// --- HELPERS STYLISÉS ---
const StyledTextField = (props: any) => (
    <TextField
        {...props}
        size="small"
        variant="outlined"
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                transition: '0.2s',
                '&:hover': { backgroundColor: '#fcfcfc' },
                '&.Mui-focused': { backgroundColor: '#ffffff' }
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
                    sx={{ borderRadius: '8px', backgroundColor: '#ffffff' }}
                >
                    {options.map((opt: any) => (
                        // 🟢 FIX ICI : On vérifie opt._id en priorité (format MongoDB)
                        <MenuItem key={opt._id || opt.id} value={opt._id || opt.id}>
                            {opt.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}
    />
);

const MultiSelect = ({ name, label, control, options }: any) => (
    <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    multiple
                    value={Array.isArray(field.value) ? field.value : []}
                    input={<OutlinedInput label={label} sx={{ borderRadius: '8px' }} />}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                    renderValue={(selected: any) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected || []).map((val: any) => (
                                <Chip
                                    key={val}
                                    label={options.find((o: any) => o.id === val)?.name || val}
                                    size="small"
                                    sx={{ borderRadius: '4px', fontWeight: 'bold' }}
                                    onDelete={() => {
                                        const newValue = field.value.filter((v: any) => v !== val);
                                        field.onChange(newValue);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                            ))}
                        </Box>
                    )}
                >
                    {options.map((opt: any) => (
                        <MenuItem key={opt.id} value={opt.id}>{opt.name}</MenuItem>
                    ))}
                </Select>
            )}
        />
    </FormControl>
);

// --- COMPOSANT PRINCIPAL ---
interface PersonDialogProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: IPerson) => void; // On pourra typer le data plus tard selon ce que ton action attend
    initialData?: IPerson | null; // Peut être une IPerson, null, ou absent (undefined)
    isTargetDefault?: boolean;
}

export default function PersonDialog({ open, onClose, onSave, initialData, isTargetDefault = true }: PersonDialogProps) {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    const { data: metadata = [] } = useSWR('/api/metadata', queryer);
    const { data: allPersons = [] } = useSWR('/api/persons', queryer);
    const { data: allVehicles = [] } = useSWR('/api/vehicles', queryer);

    const { control, handleSubmit, reset, watch, setValue } = useForm({
        // defaultValues: {
        //     firstname: '', lastname: '', nickname: '', birthDate: '',
        //     diverLicence: '', fps: '', phone: '', email: '',
        //     wanted: false, isTarget: isTargetDefault, notes: '',
        //     sex: '', origin: '', personStatus: '',
        //     hairType: '', hairColor: '', eyeColor: '',
        //     activitySector: [] as string[],
        //     filesRelated: [] as string[],
        //     address: [] as any[],
        //     tattoo: [] as any[],
        //     piercings: [] as any[],
        //     scars: [] as any[],
        //     relations: [] as any[],
        //     vehicles: [] as any[],
        //     activities: [] as string[],
        //     conditions: [] as string[]
        // }
        defaultValues: initialData || null
    });

    const { fields: addrFields, append: appendAddr, remove: removeAddr } = useFieldArray({ control, name: "address" });
    const { fields: tattooFields, append: appendTattoo, remove: removeTattoo } = useFieldArray({ control, name: "tattoo" });
    const { fields: piercingFields, append: appendPiercing, remove: removePiercing } = useFieldArray({ control, name: "piercings" });
    const { fields: scarFields, append: appendScar, remove: removeScar } = useFieldArray({ control, name: "scars" });
    const { fields: relFields, append: appendRel, remove: removeRel } = useFieldArray({ control, name: "personRelations" });
    const { fields: vehFields, append: appendVeh, remove: removeVeh } = useFieldArray({ control, name: "vehicleRelations" });

    const currentPhoto = watch('filesRelated');

    useEffect(() => {
        if (open) {
            setTabIndex(0);
            if (initialData) {
                // Fonction utilitaire pour extraire proprement l'identifiant (ID) des objets de métadonnées
                const extractId = (field: any) => {
                    if (!field) return '';
                    return typeof field === 'object' ? field.id || field._id || '' : field;
                };

                // Formater la date en YYYY-MM-DD exigé par le composant graphique natif
                let formattedBirthDate = '';
                if (initialData.birthDate) {
                    const dateObj = new Date(initialData.birthDate);
                    if (!isNaN(dateObj.getTime())) {
                        formattedBirthDate = dateObj.toISOString().split('T')[0];
                    }
                }

                reset({
                    firstname: initialData.firstname || '',
                    lastname: initialData.lastname || '',
                    nickname: initialData.nickname || '',
                    birthDate: formattedBirthDate,
                    diverLicence: initialData.diverLicence || '',
                    fps: initialData.fps || '',
                    phone: initialData.phone || '',
                    email: initialData.email || '',
                    wanted: !!initialData.wanted,
                    isTarget: initialData.isTarget !== undefined ? !!initialData.isTarget : isTargetDefault,
                    notes: initialData?.notes || '',
                    sex: extractId(initialData.sex),
                    origin: extractId(initialData.origin),
                    personStatus: extractId(initialData.personStatus),
                    hairType: extractId(initialData.hairType),
                    hairColor: extractId(initialData.hairColor),
                    eyeColor: extractId(initialData.eyeColor),

                    // Normalisation des tableaux simples (IDs ou objets)
                    activitySector: Array.isArray(initialData.activitySector)
                        ? initialData.activitySector.map((s: any) => s.id || s._id || s)
                        : [],
                    activities: Array.isArray(initialData.activities)
                        ? initialData.activities.map((a: any) => a.id || a._id || a)
                        : [],
                    conditions: Array.isArray(initialData.conditions)
                        ? initialData.conditions.map((c: any) => c.id || c._id || c)
                        : [],
                    filesRelated: Array.isArray(initialData.filesRelated) ? initialData.filesRelated : [],

                    // Normalisation des tableaux d'objets complexes (useFieldArray)
                    address: Array.isArray(initialData.address) ? initialData.address.map((a: any) => ({
                        civic: a.civic || '',
                        apartment: a.apartment || '',
                        street: a.street || '',
                        city: a.city || '',
                        postalCode: a.postalCode || '',
                        type: a.type || 'Domicile'
                    })) : [],
                    tattoo: Array.isArray(initialData.tattoo) ? initialData.tattoo.map((t: any) => ({
                        region: extractId(t.region),
                        description: t.description || ''
                    })) : [],
                    scars: Array.isArray(initialData.scars) ? initialData.scars.map((s: any) => ({
                        region: extractId(s.region),
                        description: s.description || ''
                    })) : [],
                    piercings: Array.isArray(initialData.piercings) ? initialData.piercings.map((p: any) => ({
                        region: extractId(p.region),
                        description: p.description || ''
                    })) : [],
                    personRelations: Array.isArray(initialData?.personRelations) ? initialData.personRelations.map((r: any) => ({
                        person: typeof r.person === 'object' ? r.person?._id || r.person?.id || '' : r.person || '',
                        role: r.role || ''
                    })) : [],
                    vehicleRelations: Array.isArray(initialData?.vehicleRelations) ? initialData.vehicleRelations.map((v: any) => ({
                        vehicle: typeof v.vehicle === 'object' ? v.vehicle?._id || v.vehicle?.id || '' : v.vehicle || '',
                        role: v.role || ''
                    })) : []
                });
            } else {
                reset({
                    firstname: '', lastname: '', nickname: '', birthDate: '', diverLicence: '', fps: '', phone: '', email: '',
                    isTarget: isTargetDefault, wanted: false, filesRelated: [],
                    sex: '', origin: '', personStatus: '', eyeColor: '', hairColor: '', hairType: '',
                    activitySector: [], address: [], tattoo: [], piercings: [], scars: [], relations: [], vehicles: [], activities: [], conditions: []
                });
            }
        }
    }, [open, initialData, reset, isTargetDefault]);

    const getOptions = (type: string) => metadata.filter((m: any) => m.type === type);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}>
            <DialogTitle sx={{ p: 0, background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`, color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: '12px', display: 'flex' }}>
                        <Icon path={mdiAccountPlus} size={1.2} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{initialData ? 'Modification Dossier' : 'Nouvelle Fiche Individu'}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Système de gestion des individus d'intérêt</Typography>
                    </Box>
                </Stack>
                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} textColor="inherit" variant="fullWidth" sx={{ bgcolor: 'rgba(0,0,0,0.1)', '& .MuiTabs-indicator': { backgroundColor: theme.palette.secondary.main, height: 4 } }}>
                    <Tab label="IDENTITÉ" /><Tab label="PHYSIQUE" /><Tab label="ADRESSES" /><Tab label="RELATIONS" /><Tab label="ACTIVITÉ INTÉRÊTS" />
                </Tabs>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSave)}>
                <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: 500 }}>

                    {/* ONGLET 1 : IDENTITÉ */}
                    {tabIndex === 0 && (
                        <Stack spacing={3} sx={{ width: '100%' }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                                <Stack alignItems="center" spacing={2} sx={{ minWidth: 200 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar src={currentPhoto?.[0]} variant="rounded" sx={{ width: 180, height: 220, borderRadius: '12px', border: '1px solid #ddd', boxShadow: theme.shadows[2] }} />
                                        {currentPhoto?.length > 0 && (
                                            <IconButton
                                                size="small"
                                                onClick={() => setValue('filesRelated', [])}
                                                sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' }, boxShadow: 2 }}
                                            >
                                                <Icon path={mdiClose} size={0.6}/>
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Button variant="outlined" component="label" startIcon={<Icon path={mdiCamera} size={0.7}/>} sx={{ borderRadius: '20px' }}>
                                        Photo <input type="file" hidden onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setValue('filesRelated', [URL.createObjectURL(file)]);
                                    }} />
                                    </Button>
                                </Stack>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>Informations civiles</Typography>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={2}>
                                            <Controller name="lastname" control={control} render={({ field }) => <StyledTextField {...field} label="Nom" fullWidth required />} />
                                            <Controller name="firstname" control={control} render={({ field }) => <StyledTextField {...field} label="Prénom" fullWidth required />} />
                                        </Stack>
                                        <Stack direction="row" spacing={2}>
                                            <Controller name="nickname" control={control} render={({ field }) => <StyledTextField {...field} label="Alias" fullWidth />} />
                                            <Controller name="fps" control={control} render={({ field }) => <StyledTextField {...field} label="FPS" fullWidth />} />
                                        </Stack>
                                        <Stack direction="row" spacing={2}>
                                            <Controller name="birthDate" control={control} render={({ field }) => <StyledTextField {...field} type="date" label="Date de naissance" fullWidth InputLabelProps={{ shrink: true }} />} />
                                            <Controller name="diverLicence" control={control} render={({ field }) => <StyledTextField {...field} label="Permis" fullWidth />} />
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Stack>

                            <Paper sx={{ p: 2.5, bgcolor: theme.palette.primary.main, borderRadius: '12px', boxShadow: theme.shadows[3] }}>
                                <Stack direction="row" spacing={6} justifyContent="center">
                                    <Controller name="isTarget" control={control} render={({ field }) => (
                                        <FormControlLabel control={<Switch {...field} checked={field.value} color="secondary" />} label={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>Individu d'intérêt</Typography>} />
                                    )}/>
                                    <Controller name="wanted" control={control} render={({ field }) => (
                                        <FormControlLabel control={<Switch {...field} checked={field.value} color="error" />} label={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>🚨 RECHERCHÉ</Typography>} />
                                    )}/>
                                </Stack>
                            </Paper>
                        </Stack>
                    )}

                    {/* ONGLET 2 : PHYSIQUE */}
                    {tabIndex === 1 && (
                        <Stack spacing={3}>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>Signalement Physique</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                <MetadataDropdown name="sex" label="Sexe" control={control} options={getOptions('sex')} />
                                <MetadataDropdown name="origin" label="Origine" control={control} options={getOptions('origin')} />
                                <MetadataDropdown name="personStatus" label="Statut" control={control} options={getOptions('person-status')} />
                                <MetadataDropdown name="eyeColor" label="Yeux" control={control} options={getOptions('eye-color')} />
                                <MetadataDropdown name="hairColor" label="Cheveux" control={control} options={getOptions('hair-color')} />
                                <MetadataDropdown name="hairType" label="Type" control={control} options={getOptions('hair-type')} />
                            </Box>

                            <Divider sx={{ my: 1 }}><Chip label="Marques & Identifiants" size="small" /></Divider>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                <Stack spacing={1}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}><Icon path={mdiIdentifier} size={0.5}/> TATTOOS</Typography>
                                    {tattooFields.map((f, i) => (
                                        <Paper key={f.id} variant="outlined" sx={{ p: 1, position: 'relative', pr: 4, bgcolor: '#fff' }}>
                                            <IconButton size="small" color="error" sx={{ position: 'absolute', right: 2, top: 2 }} onClick={() => removeTattoo(i)}><Icon path={mdiDelete} size={0.5}/></IconButton>
                                            <MetadataDropdown name={`tattoo.${i}.region`} label="Région" control={control} options={getOptions('body-part')} />
                                            <Controller name={`tattoo.${i}.description`} control={control} render={({field}) => <StyledTextField {...field} label="Desc." fullWidth sx={{ mt: 1 }} /> } />
                                        </Paper>
                                    ))}
                                    <Button size="small" startIcon={<Icon path={mdiPlus} size={0.5}/>} onClick={() => appendTattoo({region:'', description:''})}>Ajouter</Button>
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}><Icon path={mdiIdentifier} size={0.5}/> CICATRICES</Typography>
                                    {scarFields.map((f, i) => (
                                        <Paper key={f.id} variant="outlined" sx={{ p: 1, position: 'relative', pr: 4, bgcolor: '#fff' }}>
                                            <IconButton size="small" color="error" sx={{ position: 'absolute', right: 2, top: 2 }} onClick={() => removeScar(i)}><Icon path={mdiDelete} size={0.5}/></IconButton>
                                            <MetadataDropdown name={`scars.${i}.region`} label="Région" control={control} options={getOptions('body-part')} />
                                            <Controller name={`scars.${i}.description`} control={control} render={({field}) => <StyledTextField {...field} label="Desc." fullWidth sx={{ mt: 1 }} /> } />
                                        </Paper>
                                    ))}
                                    <Button size="small" startIcon={<Icon path={mdiPlus} size={0.5}/>} onClick={() => appendScar({region:'', description:''})}>Ajouter</Button>
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}><Icon path={mdiIdentifier} size={0.5}/> PIERCINGS</Typography>
                                    {piercingFields.map((f, i) => (
                                        <Paper key={f.id} variant="outlined" sx={{ p: 1, position: 'relative', pr: 4, bgcolor: '#fff' }}>
                                            <IconButton size="small" color="error" sx={{ position: 'absolute', right: 2, top: 2 }} onClick={() => removePiercing(i)}><Icon path={mdiDelete} size={0.5}/></IconButton>
                                            <MetadataDropdown name={`piercings.${i}.region`} label="Région" control={control} options={getOptions('body-part')} />
                                            <Controller name={`piercings.${i}.description`} control={control} render={({field}) => <StyledTextField {...field} label="Desc." fullWidth sx={{ mt: 1 }} /> } />
                                        </Paper>
                                    ))}
                                    <Button size="small" startIcon={<Icon path={mdiPlus} size={0.5}/>} onClick={() => appendPiercing({region:'', description:''})}>Ajouter</Button>
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    {/* ONGLET 3 : ADRESSES */}
                    {tabIndex === 2 && (
                        <Stack spacing={2}>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>Adresses connues</Typography>
                            {addrFields.map((item, index) => (
                                <Paper key={item.id} variant="outlined" sx={{ p: 2, pr: 6, borderRadius: '12px', bgcolor: '#fff', position: 'relative' }}>
                                    <IconButton color="error" onClick={() => removeAddr(index)} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}><Icon path={mdiDelete} size={0.7}/></IconButton>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1.5 }}>
                                        <Box sx={{ gridColumn: 'span 3' }}><Controller name={`address.${index}.civic`} control={control} render={({field}) => <StyledTextField {...field} label="Civique" fullWidth />}/></Box>
                                        <Box sx={{ gridColumn: 'span 3' }}><Controller name={`address.${index}.apartment`} control={control} render={({field}) => <StyledTextField {...field} label="App." fullWidth />}/></Box>
                                        <Box sx={{ gridColumn: 'span 6' }}><Controller name={`address.${index}.street`} control={control} render={({field}) => <StyledTextField {...field} label="Rue" fullWidth />}/></Box>
                                        <Box sx={{ gridColumn: 'span 8' }}><Controller name={`address.${index}.city`} control={control} render={({field}) => <StyledTextField {...field} label="Ville" fullWidth />}/></Box>
                                        <Box sx={{ gridColumn: 'span 4' }}><Controller name={`address.${index}.postalCode`} control={control} render={({field}) => <StyledTextField {...field} label="Code Postal" fullWidth />}/></Box>
                                    </Box>
                                </Paper>
                            ))}
                            <Button variant="dashed" startIcon={<Icon path={mdiPlus} size={0.6}/>} onClick={() => appendAddr({ civic: '', apartment: '', street: '', city: '', postalCode: '', type: 'Domicile' })} sx={{ border: '1px dashed #ccc', borderRadius: '12px', py: 1.5 }}>Ajouter localisation</Button>
                        </Stack>
                    )}

                    {/* ONGLET 4 : RELATIONS */}
                    {tabIndex === 3 && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>Individus Reliés</Typography>
                                {relFields.map((field, index) => (
                                    <Paper key={field.id} variant="outlined" sx={{ p: 2, mb: 1, borderRadius: '12px', bgcolor: '#fff' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>

                                                {/* 🟢 LE FIX : name utilise maintenant 'personRelations' */}
                                                <Box sx={{ flex: 2 }}>
                                                    <Controller
                                                        name={`personRelations.${index}.person`}
                                                        control={control}
                                                        render={({ field: selectField }) => (
                                                            <FormControl fullWidth size="small">
                                                                <InputLabel>Sujet</InputLabel>
                                                                <Select
                                                                    {...selectField}
                                                                    label="Sujet"
                                                                    sx={{ borderRadius: '8px' }}
                                                                    value={selectField.value || ''}
                                                                    renderValue={(selected) => {
                                                                        if (!selected) return "";
                                                                        const person = allPersons.find((p: any) => p._id === selected);
                                                                        return person ? `${person.lastname?.toUpperCase()}, ${person.firstname}` : "Individu inconnu";
                                                                    }}
                                                                >
                                                                    {allPersons.map((p: any) => (
                                                                        <MenuItem key={p._id} value={p._id}>
                                                                            {p.lastname?.toUpperCase()}, {p.firstname}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Box>

                                                {/* 🟢 SELECTION DU RÔLE DE LA RELATION (Complice, Suspect, etc.) */}
                                                <Box sx={{ flex: 1 }}>
                                                    <MetadataDropdown
                                                        name={`personRelations.${index}.role`}
                                                        label="Lien / Rôle"
                                                        control={control}
                                                        options={getOptions('person-status')}
                                                    />
                                                </Box>

                                            </Box>
                                            <IconButton color="error" onClick={() => removeRel(index)}>
                                                <Icon path={mdiDelete} size={0.8}/>
                                            </IconButton>
                                        </Stack>
                                    </Paper>
                                ))}
                                {/* 🟢 LE FIX : On s'assure d'initialiser proprement l'objet avec person et role vides lors du clic */}
                                <Button
                                    size="small"
                                    startIcon={<Icon path={mdiLinkVariant} size={0.6}/>}
                                    onClick={() => appendRel({ person: '', role: '' })}
                                >
                                    Lier individu
                                </Button>
                            </Box>

                            <Box>
                                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>Véhicules Reliés</Typography>
                                {vehFields.map((field, index) => (
                                    <Paper key={field.id} variant="outlined" sx={{ p: 2, mb: 1, borderRadius: '12px', bgcolor: '#fff' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>

                                                {/* MENU DÉROULANT : CHOIX DU VÉHICULE */}
                                                <Box sx={{ flex: 2 }}>
                                                    <Controller
                                                        name={`vehicleRelations.${index}.vehicle`}
                                                        control={control}
                                                        render={({ field: selectField }) => (
                                                            <FormControl fullWidth size="small">
                                                                <InputLabel>Sélectionner un véhicule</InputLabel>
                                                                <Select
                                                                    {...selectField}
                                                                    label="Sélectionner un véhicule"
                                                                    sx={{ borderRadius: '8px' }}
                                                                    value={selectField.value || ''}
                                                                    renderValue={(selected) => {
                                                                        if (!selected) return "";
                                                                        const veh = allVehicles.find((v: any) => v._id === selected);
                                                                        return veh ? `Plaque : ${veh.plate}` : "Véhicule inconnu";
                                                                    }}
                                                                >
                                                                    {allVehicles.map((v: any) => (
                                                                        <MenuItem key={v._id} value={v._id}>
                                                                            Plaque : {v.plate}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Box>

                                                {/* 🟢 NOUVEAU MENU DÉROULANT : RÔLE (Via Métadonnées) */}
                                                <Box sx={{ flex: 1 }}>
                                                    <MetadataDropdown
                                                        name={`vehicleRelations.${index}.role`}
                                                        label="Rôle / Statut"
                                                        control={control}
                                                        options={getOptions('person-status')}
                                                    />
                                                </Box>

                                            </Box>
                                            <IconButton color="error" onClick={() => removeVeh(index)}>
                                                <Icon path={mdiDelete} size={0.8}/>
                                            </IconButton>
                                        </Stack>
                                    </Paper>
                                ))}
                                <Button
                                    size="small"
                                    startIcon={<Icon path={mdiPlus} size={0.6}/>}
                                    onClick={() => appendVeh({ vehicle: '', role: '' })}
                                >
                                    Lier un véhicule
                                </Button>
                            </Box>
                        </Stack>
                    )}

                    {/* ONGLET 5 : ACTIVITÉ INTÉRÊTS */}
                    {tabIndex === 4 && (
                        <Stack spacing={3}>
                            <MultiSelect name="activities" label="Activités criminelles" control={control} options={getOptions('activity')} />
                            <MultiSelect name="conditions" label="Conditions / Ordonnances" control={control} options={getOptions('condition')} />
                            <MultiSelect name="activitySector" label="Secteurs d'activités" control={control} options={getOptions('sector')} />
                            <Controller name="notes" control={control} render={({field}) => <StyledTextField {...field} label="Observations" fullWidth multiline rows={6} />}/ >
                        </Stack>
                        )}
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                    <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Annuler</Button>
                    <Button type="submit" variant="contained" startIcon={<Icon path={mdiCheckCircleOutline} size={0.8}/>} sx={{ px: 6, borderRadius: '12px', fontWeight: 'bold' }}>Enregistrer le dossier</Button>
                </DialogActions>
            </form>
        </Dialog>
);
}