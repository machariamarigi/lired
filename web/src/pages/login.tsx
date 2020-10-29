import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { useRouter } from 'next/dist/client/router'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { withUrqlClient } from 'next-urql'
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
                        <Button 
                            mt={4}
                            type="submit"
                            colorScheme="green"
                            isLoading={isSubmitting}
                        >
                                Login
                        </Button>
                    </Form>
                    
                )}
            </Formik>            
        </Wrapper>

    )
}

export default withUrqlClient(createUrqlClient)(Login)
