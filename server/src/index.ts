import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import MikroORMConfig from './mikro-orm.config'
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
    await orm.getMigrator().up()

    const server = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    })

    apolloServer.applyMiddleware({ app: server })

    server.listen(4000, () => {
        console.log('Server set up on localhost:4000')
    })
}

main().catch(err => console.log(err))
