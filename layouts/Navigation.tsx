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
    Menu, MenuItem,
    Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useColorMode } from "@/layouts/ThemeRegistry";
import { MENU_ITEMS } from "@/config/const/menuItems";
import Icon from "@mdi/react";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { SUBMENU_ITEMS } from "@/config/const/submenuItems";

const drawerWidth = 240;

export default function Navigation() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const colorMode = useColorMode();
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // On initialise l'état une seule fois au chargement pour savoir quel menu est actif
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        MENU_ITEMS.forEach(item => {
            if (item.children?.some(child => child.path === pathname)) {
                initialState[item.name] = true;
            }
        });
        return initialState;
    });

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleToggleSubmenu = (name: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const open = Boolean(anchorEl);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = !!openMenus[item.name];
                    const isActive = pathname === item.path || item.children?.some(child => pathname === child.path);

                    return (
                        <React.Fragment key={item.name}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={hasChildren ? 'div' : Link}
                                    href={hasChildren ? undefined : item.path}
                                    onClick={() => {
                                        if (hasChildren) {
                                            handleToggleSubmenu(item.name);
                                        } else {
                                            setMobileOpen(false);
                                        }
                                    }}
                                    sx={{
                                        '&.Mui-selected': { backgroundColor: 'transparent' },
                                        '&.Mui-selected:hover': { backgroundColor: 'transparent' },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiSvgIcon-root': {
                                                color: '#ECC776',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? '#ECC776' : 'inherit', minWidth: 40 }}>
                                        <Icon path={item.icon} size={1} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontWeight: isActive ? 'bold' : 'medium',
                                                color: isActive ? '#ECC776' : 'inherit',
                                                transition: 'color 0.2s ease-in-out',
                                            }
                                        }}
                                    />
                                    {hasChildren && (isOpen ? <ExpandLess sx={{ transition: 'color 0.2s' }} /> : <ExpandMore sx={{ transition: 'color 0.2s' }} />)}
                                </ListItemButton>
                            </ListItem>

                            {hasChildren && (
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children!.map((child) => {
                                            const isChildActive = pathname === child.path;
                                            return (
                                                <ListItemButton
                                                    key={child.name}
                                                    component={Link}
                                                    href={child.path}
                                                    onClick={() => {
                                                        // ON NE TOUCHE PAS À openMenus ICI
                                                        // On ferme seulement le tiroir sur mobile
                                                        if (mobileOpen) setMobileOpen(false);
                                                    }}
                                                    sx={{
                                                        pl: 4,
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                                                color: '#ECC776',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ color: isChildActive ? '#ECC776' : 'inherit', minWidth: 40 }}>
                                                        <Icon path={child.icon} size={0.8} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={child.name}
                                                        primaryTypographyProps={{
                                                            sx: {
                                                                fontSize: '0.9rem',
                                                                fontWeight: isChildActive ? 'bold' : 'normal',
                                                                color: isChildActive ? '#ECC776' : 'inherit',
                                                            }
                                                        }}
                                                    />
                                                </ListItemButton>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
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
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* ... (Reste de l'AppBar inchangé) ... */}
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
                            <Image src="/logoRiprsl.png" alt="Nexus RSL" width={45} height={45} style={{ objectFit: 'contain' }} priority />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', letterSpacing: '0.5px' }}>Nexus</Typography>
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
                                display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 1, borderRadius: 2, transition: 'all 0.2s ease-in-out',
                                backgroundColor: 'transparent !important',
                                '&:hover': { '& .MuiTypography-root, & .MuiAvatar-root': { color: '#EECC7D' } },
                            }}
                        >
                            <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>John Doe</Typography>
                                <Typography variant="caption" color="text.secondary">mat. 728</Typography>
                            </Box>
                            <Avatar sx={{ width: 35, height: 35, bgcolor: '#ECC776', color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>JD</Avatar>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                sx: { mt: 1.5, minWidth: 180, backgroundColor: 'background.paper', border: (theme) => `1px solid ${theme.palette.divider}` }
                            }}
                        >
                            {SUBMENU_ITEMS.map((subItem) => (
                                <MenuItem
                                    key={subItem.name}
                                    component={subItem.path === '/' ? 'li' : Link}
                                    href={subItem.path}
                                    onClick={handleClose}
                                    sx={{
                                        '&:hover': { backgroundColor: 'transparent !important', '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#EECC7D' } }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Icon path={subItem.icon} size={0.9} /></ListItemIcon>
                                    <ListItemText primary={subItem.name} primaryTypographyProps={{ variant: 'body2' }} />
                                </MenuItem>
                            ))}
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
        </>
    );
}