import { withUrqlClient } from 'next-urql'
import NextLink from "next/link"
import { Box, Heading, Link, Stack, Text } from '@chakra-ui/core'
import { createUrqlClient } from "../utils/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"
import Layout from "../components/Layout"

const Index = () => {
    const [{ data }] = usePostsQuery({
        variables: { limit: 10 }
    })
    return (
        <Layout>
            <NextLink href='/create-post'>
                <Link>Create Post</Link>
            </NextLink>
            <h1>Hello There</h1>
            <br />

            <Stack>
                {!data ? null : data.posts.map((p) => (
                    <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                        <Heading fontSize="xl">{p.title}</Heading>
                        <Text>{p.textSnippet}</Text>
                    </Box>
                ))}
            </Stack>
            
        </Layout>

    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
