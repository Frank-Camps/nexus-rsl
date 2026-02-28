'use client';

import React from 'react';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Box,
    Chip
} from '@mui/material';
import Icon from '@mdi/react';
import {
    mdiCastle,
    mdiMagnifyExpand,
    mdiPoliceBadge,
} from '@mdi/js';
import Link from 'next/link';

const FORM_CATEGORIES = [
    {
        title: 'Gendarmerie',
        description: 'Baux, inspections et documents pour les plexes.',
        icon: mdiPoliceBadge,
        path: '/forms/real-estate',
        count: 3,
        color: '#ECC776'
    },
    {
        title: 'Enquête',
        description: 'Rapports d\'intervention et formulaires de patrouille.',
        icon: mdiMagnifyExpand,
        path: '/forms/rsl',
        count: 5,
        color: '#7986cb'
    },
    {
        title: 'Gouvernement',
        description: 'Documents corporatifs et gestion des partenaires.',
        icon: mdiCastle,
        path: '/forms/admin',
        count: 2,
        color: '#4db6ac'
    }
];

export default function FormsPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Centre de Formulaires
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Sélectionnez une catégorie pour accéder aux documents et outils de saisie.
            </Typography>

            <Grid container spacing={3}>
                {FORM_CATEGORIES.map((category) => (
                    <Grid  size={{xs:12, sm:6, md:4}} key={category.title}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}
                        >
                            <CardActionArea
                                component={Link}
                                href={category.path}
                                sx={{ height: '100%', p: 1 }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: `${category.color}20`,
                                                color: category.color,
                                                display: 'flex'
                                            }}
                                        >
                                            <Icon path={category.icon} size={1.2} />
                                        </Box>
                                        <Chip
                                            label={`${category.count} docs`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {category.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {category.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}