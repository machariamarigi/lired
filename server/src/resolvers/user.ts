import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { MyContext } from "../types";
import { User } from "../entities/User";


@InputType()
class UserInput {
    @Field()
    email: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em }: MyContext
    ): Promise<User | null>{
        if(!req.session.userID) {
            return null
        }

        return await em.findOne(User, { id: req.session.userID })
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('registerInput') { email, password }: UserInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse>{
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!emailRegex.test(email)) {
            return {
                errors: [{
                    field: 'email',
                    message: 'input a valid email'
                }]
            }
        }

        if (password.length < 8) {
            return {
                errors: [{
                    field: 'password',
                    message: 'password must be 8 characters or more'
                }]
            }
        }

        const hashedPassword = await argon2.hash(password)
        const user = em.create(User, { email, password: hashedPassword })
        
        try {
            await em.persistAndFlush(user)
        } catch (err) {
            if (err.code === '23505') {
                // duplicate email error
                return {
                    errors: [{
                        field: 'email',
                        message: 'email already exists'
                    }]
                }
            }
            
        }

        req.session.userID = user.id

        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('loginInput') loginInput: UserInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { email: loginInput.email })
        if (!user) {
            return {
                errors: [{
                    field: 'email',
                    message: 'could not find user with that email'
                }]
            }
        }

        const valid = await argon2.verify(user.password, loginInput.password)
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            }
        }

        req.session!.userID = user.id

        return {user}
    }
}
