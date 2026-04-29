interface InfoCardProps {
    icon?: any;
    title?: string;
    children?: any;
    color?: string;
}

const InfoCard = ({ icon, title, children, color }: InfoCardProps) => (
    <Paper
        variant="outlined"
        sx={{
            p: 2.5, borderRadius: 3,
            borderLeft: `4px solid ${color || theme.palette.primary.main}`,
            bgcolor: isDark ? '#3d3c42' : '#ffffff',
            backgroundImage: 'none',
            height: '100%'
        }}
    >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: isDark ? '#46454B' : '#f0f2f5', color: color || theme.palette.primary.main, width: 32, height: 32 }}>
                {icon}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
                {title}
            </Typography>
        </Stack>
        {children}
    </Paper>
);

export default InfoCard;