import React from 'react'
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { Heading } from '@chakra-ui/core';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { usePostQuery } from '../../generated/graphql';
import Layout from '../../components/Layout';



const Post = ({}) => {
    const router = useRouter()
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })

    if (fetching) {
        return(
            <Layout>
                <div>Loading...</div>
            </Layout>
        )
    }

    if (!data?.post) {
        <Layout>
            <div>Could not find post</div>
        </Layout>
    }

    return (
        <Layout>
            <Heading mb={4}>{data?.post?.title}</Heading>
            { data?.post?.text }
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post)