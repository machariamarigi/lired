import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/core'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

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
                <Box color="white" mr={2}>{data.me.username}</Box>
                <Button 
                    variant="link"
                    color="crimson"
                    onClick={() => logout()}
                    isLoading={logoutFetching}
                >
                        Logout
                </Button>
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