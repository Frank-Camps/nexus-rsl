'use client';

import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMetadataItem } from "@/interfaces/properties/properties.interface";

interface MetadataTableProps {
    items: IMetadataItem[];
    onEdit: (item: IMetadataItem) => void;
    onDelete: (id: string) => void;
    // --- NOUVELLES PROPS ---
    onRowClick?: (item: IMetadataItem) => void;
    selectedId?: string;
}

export default function MetadataTable({ items, onEdit, onDelete, onRowClick, selectedId }: MetadataTableProps) {
    const theme = useTheme();

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'option</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => {
                        const isSelected = selectedId === item.id;

                        return (
                            <TableRow
                                key={item.id}
                                hover
                                onClick={() => onRowClick?.(item)} // Déclenche l'affichage des modèles
                                sx={{
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    // Highlight de la ligne si sélectionnée
                                    backgroundColor: isSelected ? 'action.selected' : 'inherit',
                                    '&:hover': { backgroundColor: 'action.hover' }
                                }}
                            >
                                <TableCell
                                    sx={{
                                        color: isSelected ? theme.palette.primary.main : 'inherit',
                                        fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                >
                                    {item.name}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche d'ouvrir les modèles lors du clic sur Edit
                                            onEdit(item);
                                        }}
                                    >
                                        <EditIcon fontSize="small" sx={{ color: '#ECC776' }} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche d'ouvrir les modèles lors du clic sur Delete
                                            onDelete(item.id);
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}