import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardContent>
            <Box className="flex items-center justify-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                        {value}
                    </Typography>
                </Box>
                <Box className={`p-3 rounded-full bg-${color}-100`}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default StatCard;