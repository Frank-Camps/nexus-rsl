'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme, Avatar, Stack,
    Menu, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useColorMode} from "@/layouts/ThemeRegistry";
import {MENU_ITEMS} from "@/config/const/menuItems";
import Icon from "@mdi/react";
import {usePathname} from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import {SUBMENU_ITEMS} from "@/config/const/submenuItems";

const drawerWidth = 240;

export default function Navigation() {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const colorMode = useColorMode();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const open = Boolean(anchorEl);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Contenu du menu (partagé entre mobile et desktop)
    const drawerContent = (
        <div>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Nexus RSL
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {MENU_ITEMS.map((item) => {
                    const pathname = usePathname();
                    const isActive = pathname === item.path;

                    return (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    // On retire le carré bleu/gris de sélection par défaut
                                    '&.Mui-selected': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    // Style au survol (Hover)
                                    '&:hover': {
                                        backgroundColor: 'transparent', // On garde le fond transparent
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: '#ECC776', // Ta couleur de hover
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? '#ECC776' : 'inherit',
                                        minWidth: 40 // Ajuste l'espacement entre l'icône et le texte
                                    }}
                                >
                                    <Icon path={item.icon} size={1} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontWeight: isActive ? 'bold' : 'medium',
                                            color: isActive ? '#ECC776' : 'inherit',
                                            transition: 'color 0.2s ease-in-out', // Animation douce pour le hover
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    // On utilise 'paper' qui correspond maintenant à ton gris de menu
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    backgroundImage: 'none', // Sécurité supplémentaire
                    boxShadow: 'none', // On enlève l'ombre pour un look "Flat" plus moderne
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`, // Une fine ligne au lieu d'une ombre
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }} // Cache l'icône sur PC
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
                            <Image
                                src="/logoRiprsl.png"
                                alt="Nexus RSL"
                                width={45}  // Taille réduite pour l'icône seule
                                height={45}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.primary', // Utilise la couleur du thème (blanc/noir)
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Nexus
                            </Typography>
                        </Link>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>

                        <Divider orientation="vertical" flexItem sx={{ my: 2 }} />

                        <Box
                            onClick={handleProfileClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer',
                                p: 1,
                                borderRadius: 2,
                                transition: 'all 0.2s ease-in-out',

                                // On force le fond à être TOUJOURS transparent
                                backgroundColor: 'transparent !important',

                                // On retire l'effet de feedback visuel de Material UI
                                '&:active, &:focus, &:focus-visible': {
                                    backgroundColor: 'transparent !important',
                                    outline: 'none',
                                },

                                '&:hover': {
                                    // Seule interaction permise : ton changement de couleur Gold
                                    '& .MuiTypography-root, & .MuiAvatar-root': {
                                        color: '#EECC7D',
                                    },
                                },

                                // Élimine le flash gris sur mobile/tablette
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1, transition: 'color 0.2s' }}>
                                    John Doe
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    mat. 728
                                </Typography>
                            </Box>
                            <Avatar
                                sx={{
                                    width: 35,
                                    height: 35,
                                    bgcolor: '#ECC776',
                                    color: '#000',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s'
                                }}
                            >
                                JD
                            </Avatar>
                        </Box>

                        {/* Menu déroulant de l'avatar */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                sx: {
                                    mt: 1.5,
                                    minWidth: 180,
                                    boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
                                    backgroundImage: 'none',
                                    backgroundColor: 'background.paper',
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                }
                            }}
                        >
                            {SUBMENU_ITEMS.map((subItem) => (
                                <MenuItem
                                    key={subItem.name}
                                    component={subItem.path === '/' ? 'li' : Link} // 'li' si c'est juste une action, Link si c'est une page
                                    href={subItem.path}
                                    onClick={handleClose}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.2s ease-in-out',
                                        backgroundColor: 'transparent !important', // Neutralise le gris au clic
                                        '&:hover': {
                                            backgroundColor: 'transparent !important',
                                            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                                color: '#EECC7D', // Ton hover Gold
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, transition: 'color 0.2s', color: 'inherit' }}>
                                        <Icon path={subItem.icon} size={0.9} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={subItem.name}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            fontWeight: 'medium'
                                        }}
                                    />
                                </MenuItem>
                            ))}
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box component="nav">
                {/* Drawer Mobile (Temporaire) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }} // Meilleure performance sur mobile
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Drawer Desktop (Permanent) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
}