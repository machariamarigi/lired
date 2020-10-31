import { Button, Box } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPasword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    return (
        <Wrapper varient="Small">
        <Formik
            initialValues={{ email: '' }}
            onSubmit={ async (values, { setErrors }) => {
                await forgotPassword(values)
                setComplete(true)
            }}
        >
            {({ isSubmitting }) => complete ?
            <Box>
                Email sent if used in an existing account
            </Box> :
            (
                <Form>
                    <InputField
                        name="email"
                        placeholder="email"
                        label="Email"
                        type="email"
                    />

                    
                    <Button 
                        mt={4}
                        type="submit"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                    >
                            Forgot Password
                    </Button>
                </Form>
                
            )}
        </Formik>            
    </Wrapper>      
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPasword)
