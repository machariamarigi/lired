import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import { useRouter } from 'next/dist/client/router'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'


interface RegisterProps {
}

const Register: React.FC<RegisterProps> = ({}) => {
    const [, register] = useRegisterMutation()
    const router = useRouter()

    return ( 
        <Wrapper varient="Small">
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                onSubmit={ async (values, { setErrors }) => {
                    const response = await register({ userInput: values })
                    console.log(response.data?.register)
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        console.log(response.data?.register.user)
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="Username" label="Username" />
                        <Box mt={4}></Box>
                        <InputField name="email" placeholder="Email" label="Email" />
                        <Box mt={4}></Box>
                        <InputField name="password" placeholder="Password" label="Password" type="password"/> 
                        <Button 
                            mt={4}
                            type="submit"
                            colorScheme="green"
                            isLoading={isSubmitting}
                        >
                                Register
                        </Button>
                    </Form>
                    
                )}
            </Formik>            
        </Wrapper>

    )
}

export default withUrqlClient(createUrqlClient)(Register)
