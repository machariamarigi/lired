import { Box } from '@chakra-ui/core';
import React from 'react'

interface WrapperProps {
    varient?: 'Small' | 'Regular'
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
