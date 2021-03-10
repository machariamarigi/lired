import "reflect-metadata"
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, CORS_ORIGIN, DATABASE_URL, PORT, REDIS_SECRET, REDIS_URL, __prod__ } from "./constants";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { Vote } from "./entities/Vote";
import { VoteResolver } from "./resolvers/vote";
import { createUserLoader } from "./utils/createUserLoader";
import { createVoteLoader } from "./utils/createVoteLoader";

const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        url: DATABASE_URL,
        logging: true,
        entities: [User, Post, Vote],
        synchronize: !__prod__,
        migrations: [path.join(__dirname, './migrations/*')]
    })

    await conn.runMigrations()

    const server = express()

    server.set("proxy", 1)

    server.use(
        cors({
            origin: CORS_ORIGIN,
            credentials: true       
        })
    )

    const RedisStore = connectRedis(session)
    const redis = new Redis(REDIS_URL)

    server.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365, // 10 years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__, 
                domain: __prod__ ? 'codepondr.com' : undefined
            },
            secret: REDIS_SECRET,
            resave: false,
            saveUninitialized: false
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver, VoteResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            voteLoader: createVoteLoader()
        }),
    })

    apolloServer.applyMiddleware({
        app: server,
        cors: false
    })

    server.listen(PORT, () => {
        console.log('Server set up on localhost:4000')
    })
}

main().catch(err => console.log(err))
