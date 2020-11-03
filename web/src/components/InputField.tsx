import React, { InputHTMLAttributes } from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core'
import { useField } from 'formik'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string
    label: string
    textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size : _,
    ...props}) => {
    let InputOrTextarea: any = Input
    if (textarea) {
        InputOrTextarea = Textarea
    }
    const [field, { error }] = useField(props)

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{ label }</FormLabel>
            <InputOrTextarea {...field} {...props} id={field.name} placeholder={props.placeholder} type={props.type} />
            { error ? <FormErrorMessage>{error}</FormErrorMessage> : null  }
        </FormControl>
    );
}

export default InputField
