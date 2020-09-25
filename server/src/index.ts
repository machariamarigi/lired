import { MikroORM } from "@mikro-orm/core";
import express from 'express';
import MikroORMConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
    await orm.getMigrator().up()

    const server = express()

    server.listen(4000, () => {
        console.log('Server set up on localhost:4000')
    })

}

main().catch(err => console.log(err))
