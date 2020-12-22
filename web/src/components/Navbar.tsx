import React from 'react'
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })

    let body = null

    if (fetching) {
        // data is loading

    } else if (!data?.me) {
        // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2} color="white">Login</Link>
                </NextLink>
                <NextLink href="register">
                    <Link color="white">Register</Link> 
                </NextLink>
            </>
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
        <Flex bg="teal.500" p={4} zIndex={1} position="sticky" top={0} align="center">
            <NextLink href="/">
                <Link>
                    <Heading>MicroForum[MF]</Heading>
                </Link>
            </NextLink>
            <Box ml="auto">
                {body}
            </Box>            
        </Flex>

    )
}

export default Navbar
