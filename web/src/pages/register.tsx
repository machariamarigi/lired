import React from 'react'
import { Formik, Form } from 'formik'
import { Box, Button } from '@chakra-ui/core'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'

interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({}) => {
    return (
        <Wrapper varient="Small">
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={values => console.log(values)}
            >
                {({ isSubmitting }) => (
                    <Form>
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

export default Register
