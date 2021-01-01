import React from 'react'
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { Heading } from '@chakra-ui/core';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Layout from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';



const Post = ({}) => {
    const [{ data, fetching }] = useGetPostFromUrl()

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