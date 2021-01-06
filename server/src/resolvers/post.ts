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
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { Vote } from "../entities/Vote";
import { User } from "../entities/User";

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

    @FieldResolver(() => User)
    creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(post.creatorId)
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, { nullable: true } ) cursor: string | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit)

        const replacements: any[] = [realLimit + 1]

        if (req.session.userId) {
            replacements.push(req.session.userId)
        }

        let cursorIdx = 3
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)))
            cursorIdx = replacements.length
        }

        const posts = await getConnection().query(
            `
                SELECT p.*,
                ${
                    req.session.userId 
                    ? '(SELECT value from vote WHERE "userId" = $2 and "postId" = p.id) "voteStatus"'
                    : 'null as "voteStatus"'
                }
                from post p
                ${cursor ? `WHERE p."createdAt" < $${cursorIdx}` : ''}
                ORDER by p."createdAt" DESC
                LIMIT $1
            `,
            replacements
        )

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimit + 1
        }

    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
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
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title') title: string,
        @Arg('text') text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where(
                'id = :id and "creatorId"= :creatorId',
                {
                    id,
                    creatorId: req.session.userId
                }
            )
            .returning('*')
            .execute()

        return result.raw[0]
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        const post = await Post.findOne(id)

    if (!post) {
            return false
        }

        if (post.creatorId !== req.session.userId) {
            throw new Error('Not Authorised')
        }

        await Vote.delete({ postId: id })
        await Post.delete({ id })
        return true
    }
}
