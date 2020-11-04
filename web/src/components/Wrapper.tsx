import { Box } from '@chakra-ui/core';
import React from 'react'

export type WrapperVarient =  "Small" | "Regular";

interface WrapperProps {
    varient?: WrapperVarient
}

const Wrapper: React.FC<WrapperProps> = ({ 
    children,
    varient='Regular' 
}) => {
    return (
        <Box 
            mt={8}
            mx='auto'
            maxW={ varient === 'Regular' ? '800px' : '400px' }
            w='100%'>
            {children}
        </Box>
    );
}

export default Wrapper
