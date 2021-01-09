import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core'
import NextLink from "next/link"
import { useRouter } from 'next/router'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const router = useRouter()

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
            <Flex align="center">
                <NextLink href='/create-post'>
                    <Button as={Link} mr={4} colorScheme="pink">
                        Create Post
                    </Button>
                </NextLink>    
                <Box color="white" mr={2}>{data.me.username}</Box>
                <Button 
                    variant="link"
                    color="crimson"
                    onClick={ async () => {
                        await logout()
                        router.reload()
                    }}
                    isLoading={logoutFetching}
                >
                        Logout
                </Button>
            </Flex>
            
        )
    }
    return (
        <Flex bg="teal.500" p={4} zIndex={1} position="sticky" top={0}>
            <Flex flex={1} align="center" maxW={800} m="auto">
                <NextLink href="/">
                    <Link>
                        <Heading>MicroForum[MF]</Heading>
                    </Link>
                </NextLink>
                <Box ml="auto">
                    {body}
                </Box>
            </Flex>         
        </Flex>

    )
}

export default Navbar
