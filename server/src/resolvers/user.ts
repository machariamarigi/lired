import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from '@mikro-orm/postgresql'
import { MyContext } from "../types";
import { User } from "../entities/User";
import { COOKIE_NAME, EMAIL_REGEX } from "../constants";
import { validateRegister } from "../utils/validateRegister";

@InputType()
class UserInput {
    @Field()
    username: string
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
        @Arg('registerInput') { username, email, password }: UserInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse>{

        const validationResponse = validateRegister(username, email, password)

        if (validationResponse) {
            return validationResponse
        }

        const hashedPassword = await argon2.hash(password)
        let user;
        
        try {
            const result = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    email,
                    password: hashedPassword,
                    username,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning("*")

            user = result[0]
        } catch (err) {
            if (err.detail.includes(`Key (username)=(${username}) already exists.`)) {
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already used'
                    }]
                }
            } else if (err.detail.includes(`Key (email)=(${email}) already exists.`)) {
                return {
                    errors: [{
                        field: 'email',
                        message: 'email already used'
                    }]
                }
            }
            
        }


        req.session.userID = user.id

        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(
            User,
            EMAIL_REGEX.test(usernameOrEmail)
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail }
        )
        if (!user) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'could not find user with that username or email'
                }]
            }
        }

        const valid = await argon2.verify(user.password, password)
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

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ){
        return new Promise(resolve => req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME)
            if (err) {
                console.log(err)
                resolve(false)
                return
            }
            resolve(true)
        }))
    }

}
