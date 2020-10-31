import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button, Flex, Link, Spacer } from '@chakra-ui/core'
import { useRouter } from 'next/dist/client/router'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { createUrqlClient } from '../utils/createUrqlClient'


interface LoginProps {
}

const Login: React.FC<LoginProps> = ({}) => {
    const [, login] = useLoginMutation()
    const router = useRouter()

    return ( 
        <Wrapper varient="Small">
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={ async (values, { setErrors }) => {
                    const response = await login(values)
                    console.log(response.data?.login)
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        console.log(response.data?.login.user)
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="Username or Email" label="Username Or Email" />
                        <Box mt={4}></Box>
                        <InputField name="password" placeholder="Password" label="Password" type="password"/>
                        <Flex mt={4}>
                            <Button   
                                type="submit"
                                colorScheme="green"
                                isLoading={isSubmitting}
                            >
                                 Login
                            </Button>
                            <Spacer />
                            <Flex align="center">
                                <NextLink href="/forgot-password">
                                    <Link>forgot password?</Link>
                                </NextLink> 
                            </Flex>
                        </Flex>
                    </Form>
                    
                )}
            </Formik>            
        </Wrapper>

    )
}

export default withUrqlClient(createUrqlClient)(Login)
