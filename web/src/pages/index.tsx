import { withUrqlClient } from 'next-urql'
import NextLink from "next/link"
import { Link } from '@chakra-ui/core'
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
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
        </Layout>

    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
