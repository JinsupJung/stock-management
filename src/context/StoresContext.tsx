'use client'

import { createContext, useContext, useState, useEffect } from 'react';

interface Store {
    store_code: string;
    store_name: string;
}

interface StoresContextProps {
    selectedStore: Store | null;
    setSelectedStore: (store: Store) => void;
}

const StoresContext = createContext<StoresContextProps | undefined>(undefined);

export const StoresProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);

    // Load selected store from localStorage
    useEffect(() => {
        const storedStore = localStorage.getItem('selectedStore');
        if (storedStore) {
            setSelectedStoreState(JSON.parse(storedStore));
        }
    }, []);

    const setSelectedStore = (store: Store) => {
        setSelectedStoreState(store);
        localStorage.setItem('selectedStore', JSON.stringify(store)); // Save to localStorage
    };

    return (
        <StoresContext.Provider value={{ selectedStore, setSelectedStore }}>
            {children}
        </StoresContext.Provider>
    );
};

export const useStores = () => {
    const context = useContext(StoresContext);
    if (!context) {
        throw new Error('useStores must be used within a StoresProvider');
    }
    return context;
};



// 'use client'; // Add this line at the top to make this a client component

// import React, { createContext, useContext, useState } from 'react';

// // Define the types for your context
// interface Store {
//     store_code: string;
//     store_name: string;
// }

// interface StoresContextProps {
//     selectedStore: Store | null;
//     setSelectedStore: (store: Store) => void;
// }

// // Create the context
// const StoresContext = createContext<StoresContextProps | undefined>(undefined);

// // Create the provider
// export const StoresProvider = ({ children }: { children: React.ReactNode }) => {
//     const [selectedStore, setSelectedStore] = useState<Store | null>(null);

//     return (
//         <StoresContext.Provider value={{ selectedStore, setSelectedStore }}>
//             {children}
//         </StoresContext.Provider>
//     );
// };

// // Create a custom hook to use the context
// export const useStores = () => {
//     const context = useContext(StoresContext);
//     if (!context) {
//         throw new Error('useStores must be used within a StoresProvider');
//     }
//     return context;
// };
