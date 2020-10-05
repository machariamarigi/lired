import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
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
    @Mutation(() => User)
    async register(
        @Arg('registerInput') registerInput: UserInput,
        @Ctx() { em }: MyContext
    ): Promise<User>{
        const hashedPassword = await argon2.hash(registerInput.password)

        const user = em.create(User, { email: registerInput.email, password: hashedPassword })
        await em.persistAndFlush(user)

        return user
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('loginInput') loginInput: UserInput,
        @Ctx() { em }: MyContext
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

        return {user}
    }
}