import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { MyContext } from "../types";
import { User } from "../entities/User";


@InputType()
class UserRegistrationInput {
    @Field()
    email: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('registerInput') registerInput: UserRegistrationInput,
        @Ctx() { em }: MyContext
    ): Promise<User>{
        const hashedPassword = await argon2.hash(registerInput.password)

        const user = em.create(User, { email: registerInput.email, password: hashedPassword })
        await em.persistAndFlush(user)

        return user
    }
}