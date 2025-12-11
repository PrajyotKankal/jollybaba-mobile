// src/context/DetailPageContext.js
import React, { createContext, useState, useContext } from 'react';

const DetailPageContext = createContext();

export const useDetailPage = () => {
    const context = useContext(DetailPageContext);
    if (!context) {
        return {
            productTitle: '',
            isWishlisted: false,
            setProductTitle: () => { },
            setIsWishlisted: () => { },
            handleShare: () => { },
        };
    }
    return context;
};

export const DetailPageProvider = ({ children }) => {
    const [productTitle, setProductTitle] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [shareHandler, setShareHandler] = useState(null);

    const handleShare = () => {
        if (shareHandler) {
            shareHandler();
        }
    };

    const value = {
        productTitle,
        setProductTitle,
        isWishlisted,
        setIsWishlisted,
        handleShare,
        setShareHandler,
    };

    return (
        <DetailPageContext.Provider value={value}>
            {children}
        </DetailPageContext.Provider>
    );
};
