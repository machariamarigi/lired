import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import NextLink from "next/link"
import { Box, Flex, Heading, Link, Stack, Text, Button, IconButton } from '@chakra-ui/core'
import { createUrqlClient } from "../utils/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"
import Layout from "../components/Layout"
import VoteSection from '../components/VoteSection'


const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as null | string
    })

    const [{ data, fetching }] = usePostsQuery({
        variables
    })

    if (!fetching && !data) {
        return <div>Oops! No posts ware loaded</div>
    }

    return (
        <Layout>
            <Flex align="center">
                <Heading>MicroForum</Heading>
                <NextLink href='/create-post'>
                    <Link ml="auto">Create Post</Link>
                </NextLink>                
            </Flex>

            <br />

            <Stack>
                { fetching && !data ? <div>Loading...</div>: data!.posts.posts.map((p) => (
                    <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                        <VoteSection post={p} />
                        <Box>
                            <NextLink href="/post/[id]"  as={`/post/${p.id}`}>
                                <Link>
                                    <Heading fontSize="xl">{p.title}</Heading>
                                </Link>
                            </NextLink>
                            <Text fontSize="xs">posted by <Text as="i">{ p.creator.username }</Text></Text>
                            <Text mt={3}>{p.textSnippet}</Text>
                        </Box>
                        
                    </Flex>
                ))}
            </Stack>

            {data && data.posts.hasMore ? 
                <Flex>
                    <Button 
                        m="auto"
                        my={4}
                        isLoading={fetching}
                        onClick={() => {
                            setVariables({
                                limit: variables.limit,
                                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                            })
                        }}
                    >
                        load more...
                    </Button>
                </Flex> : null 
            }
        </Layout>

    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
