import { Heading } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
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
            <EditDeletePostButtons id={data?.post?.id!} creatorId={data?.post?.creator.id!} />
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post)
