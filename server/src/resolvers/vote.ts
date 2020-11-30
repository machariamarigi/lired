import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

import { getConnection } from "typeorm";
import { Vote } from "../entities/Vote";

@Resolver()
export class VoteResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const { userId } = req.session

        const isUpvote = value !== -1
        value = isUpvote ? 1 : -1

        const vote = await Vote.findOne({ where: { postId, userId } })


        if (vote && vote.value !== value) {
            // the user has voted on the post before
            // user is changing their vote
            console.log('update transaction')
            await getConnection().transaction(async tm => {
                await tm.query(`
                    UPDATE vote
                    SET value = $1
                    WHERE "postId" = $2 and "userId" = $3
                `, [value, postId, userId])

                await tm.query(`
                    UPDATE post
                    SET points = points + $1
                    WHERE id = $2
                `, [2 * value, postId])
            })

        } else if (!vote){
            // user has not voted before
            await getConnection().transaction(async tm => {
                await tm.query(`
                    INSERT INTO vote("userId", "postId", value)
                    VALUES ($1, $2, $3);
                `, [userId, postId, value])

                await tm.query(`
                    UPDATE post
                    SET points = points + $1
                    WHERE id = $2
                `, [value, postId])
            })
        }

        return true
    }
}
