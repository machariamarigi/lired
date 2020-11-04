import React from 'react'
import Navbar from './Navbar';
import Wrapper, { WrapperVarient } from './Wrapper';

interface LayoutProps {
    varient?: WrapperVarient
}

const Layout: React.FC<LayoutProps> = ({ children, varient }) => {
    return (
        <div>
            <Navbar />
            <Wrapper varient={varient}>
                {children}
            </Wrapper>
        </div>
    );
}

export default Layout