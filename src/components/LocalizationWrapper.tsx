// src/components/LocalizationWrapper.tsx
'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';

export default function LocalizationWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {children}
        </LocalizationProvider>
    );
}
