import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import MikroORMConfig from './mikro-orm.config';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { REDIS_SECRET, __prod__ } from "./constants";

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
    await orm.getMigrator().up()

    const server = express()

    server.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true       
        })
    )

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    server.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 10 years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__,
            },
            secret: REDIS_SECRET,
            resave: false,
            saveUninitialized: false
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    })

    apolloServer.applyMiddleware({
        app: server,
        cors: false
    })

    server.listen(4000, () => {
        console.log('Server set up on localhost:4000')
    })
}

main().catch(err => console.log(err))
