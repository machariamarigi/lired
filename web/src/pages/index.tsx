import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import NextLink from "next/link"
import { Box, Flex, Heading, Link, Stack, Text, Button } from '@chakra-ui/core'
import { createUrqlClient } from "../utils/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"
import Layout from "../components/Layout"


const Index = () => {
    const [variables, setVariables] = useState({
        limit: 10,
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
                <Heading>MicroBlog </Heading>
                <NextLink href='/create-post'>
                    <Link ml="auto">Create Post</Link>
                </NextLink>                
            </Flex>

            <br />

            <Stack>
                { fetching && !data ? <div>Loading...</div>: data!.posts.posts.map((p) => (
                    <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                        <Heading fontSize="xl">{p.title}</Heading>
                        <Text>{p.textSnippet}</Text>
                    </Box>
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
