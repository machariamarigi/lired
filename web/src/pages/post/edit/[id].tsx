import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Box, Flex, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';

const EditPost = ({}) => {
    const router = useRouter()
    const intId = useGetIntId()
    const [{ data, fetching }] = useGetPostFromUrl()
    const [, updatePost] = useUpdatePostMutation()

    if (fetching) {
        return (
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
        <Layout varient="Small">
            <Formik
                initialValues={{ title: data?.post?.title!, text: data?.post?.text! }}
                onSubmit={ async (values) => {
                    await updatePost({ id: intId, ...values })
                    router.back()
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField 
                            name="title"
                            placeholder="title"
                            label="Title" 
                        />
                        <Box mt={4}></Box>
                        <InputField 
                            name="text" placeholder="post..." label="Body" textarea />
                        <Flex mt={4}>
                            <Button   
                                type="submit"
                                colorScheme="green"
                                isLoading={isSubmitting}
                            >
                                Update Post
                            </Button>
                        </Flex>
                    </Form>
                    
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(EditPost)
