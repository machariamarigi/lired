import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import NextLink from 'next/link'
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage = () => {
    const [, changePassword] = useChangePasswordMutation()
    const router = useRouter()
    const [tokenError, setTokenError] = useState('')

    return (
        <Wrapper varient="Small">
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={ async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token: typeof router.query.token === 'string' ? router.query.token : ''
                    })
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data?.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        } 
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        console.log(response.data?.changePassword.user)
                        router.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {
                            tokenError ? 
                                <Flex>
                                    <Box color="tomato" mr={2}>
                                        {tokenError}
                                    </Box>
                                    <NextLink href="/forgot-password">
                                        <Link>get new token</Link>
                                    </NextLink>
                                </Flex>: null
                        }
                        
                        
                        <Button 
                            mt={4}
                            type="submit"
                            colorScheme="teal"
                            isLoading={isSubmitting}
                        >
                                Change Password
                        </Button>
                    </Form>
                    
                )}
            </Formik>            
        </Wrapper>   
    )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
