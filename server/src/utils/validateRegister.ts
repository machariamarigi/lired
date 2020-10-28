import { EMAIL_REGEX } from "../constants"

export const validateRegister = (username: string, email: string, password: string) => {
    if (username.length < 3) {
        return[{
            field: 'username',
            message: 'username must be 3 characters or more'
        }]
    }

    if (!EMAIL_REGEX.test(email)) {
        return [{
            field: 'email',
            message: 'input a valid email'
        }]

    }

    if (password.length < 8) {
        return [{
            field: 'password',
            message: 'password must be 8 characters or more'
        }]
        
    }

    return null
}
