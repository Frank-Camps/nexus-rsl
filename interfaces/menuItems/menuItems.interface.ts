export interface MenuItem {
    name: string;
    path: string;
    icon: string;
    role?: string;
    children?: MenuItem[];
    isExpandable?: boolean;
}