import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware
} from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
    @Field()
    title: string

    @Field()
    text: string
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]

    @Field()
    hasMore: boolean
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
        return root.text.length > 50 ? root.text.slice(0, 50) + '...' : root.text
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true } ) cursor: string | null
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit)

        const queryBuilder = getConnection()
            .getRepository(Post)
            .createQueryBuilder('p')
            .orderBy('"createdAt"', "DESC")
            .take(realLimit + 1)

        if (cursor) {
            queryBuilder.where(
                '"createdAt" < :cursor',
                { cursor: new Date(parseInt(cursor)) }
            )
        }

        const posts = await queryBuilder.getMany()

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimit + 1
        }

    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id',) id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id)
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('postInput') postInput: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        return Post.create({
            ...postInput,
            creatorId: req.session.userId
        }).save()
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id)
        if (!post) {
            return null
        }

        if (typeof title !== 'undefined') {
            post.title = title
            await Post.update({ id }, { title })
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean> {
        await  Post.delete(id)
        return true
    }
}
