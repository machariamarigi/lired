import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

import { getConnection } from "typeorm";

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

        await getConnection().query(
            `
                START TRANSACTION;

                INSERT INTO vote("userId", "postId", value)
                VALUES (${userId},${postId},${value});

                UPDATE post
                SET points = points + ${value}
                WHERE id = ${postId};

                COMMIT;
            `,
        )

        return true
    }
}
