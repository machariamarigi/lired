import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'
import NextLink from "next/link"
import React, { useState } from 'react'
import EditDeletePostButtons from '../components/EditDeletePostButtons'
import Layout from "../components/Layout"
import VoteSection from '../components/VoteSection'
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"


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
            <Stack>
                { fetching && !data ? <div>Loading...</div>: data!.posts.posts.map((p) =>
                !p ? null : (
                    <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                        <VoteSection post={p} />
                        <Box flex={1}>
                            <NextLink href="/post/[id]"  as={`/post/${p.id}`}>
                                <Link>
                                    <Heading fontSize="xl">{p.title}</Heading>
                                </Link>
                            </NextLink>
                            <Text fontSize="xs">posted by <Text as="i">{ p.creator.username }</Text></Text>
                            <Flex mt={3} align="center">
                                <Text flex={1}>{p.textSnippet}</Text>
                                <Box ml="auto">
                                    <EditDeletePostButtons id={p.id} creatorId={p.creator.id}></EditDeletePostButtons>
                                </Box>
                            </Flex>
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
