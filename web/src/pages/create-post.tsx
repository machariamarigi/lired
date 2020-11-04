import { Box, Flex, Button } from '@chakra-ui/core';
import React from 'react'
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';


const CreatePost: React.FC<{}> = ({}) => {
    const [ , createPost ] = useCreatePostMutation()
    const router = useRouter()
    useIsAuth()
    return (
        <Layout varient="Small">
            <Formik
                initialValues={{ title: '', text: '' }}
                onSubmit={ async (values) => {
                    const { error } = await createPost({ postInput: values })
                    if(!error) {
                       router.push('/') 
                    }     
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
                                Create Post
                            </Button>
                        </Flex>
                    </Form>
                    
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost)
