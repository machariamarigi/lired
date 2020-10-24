import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/core'
import NextLink from "next/link"
import { useMeQuery } from '../generated/graphql'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery()

    const usernameFromEmail = (email: string): string => {
        const index = email.indexOf('@')
        return email.substr(0, index)
    }

    let body = null

    if (fetching) {
        // data is loading

    } else if (!data?.me) {
        // user not logged in
        body = (
            <Box>
                <NextLink href="/login">
                    <Link mr={2} color="white">Login</Link>
                </NextLink>
                <NextLink href="register">
                   <Link color="white">Register</Link> 
                </NextLink>
            </Box>
        )
    } else {
        // user is logged in
        body = (
            <Flex>
                <Box color="white" mr={2}>{usernameFromEmail(data.me.email)}</Box>
                <Button variant="link" color="crimson">Logout</Button>
            </Flex>
            
        )
    }
    return (
        <Flex bg="teal.500" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>            
        </Flex>

    );
}

export default Navbar