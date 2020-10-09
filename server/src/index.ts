import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import MikroORMConfig from './mikro-orm.config';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { REDIS_SECRET, __prod__ } from "./constants";
import { MyContext } from "./types";

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
    await orm.getMigrator().up()

    const server = express()

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient()

    server.use(
        session({
            name: "qid",
            store: new RedisStore({ client: redisClient }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, // a year
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__
            },
            secret: REDIS_SECRET
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    })

    apolloServer.applyMiddleware({ app: server })

    server.listen(4000, () => {
        console.log('Server set up on localhost:4000')
    })
}

main().catch(err => console.log(err))
