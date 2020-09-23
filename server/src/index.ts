import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const main = async () => {
    const orm = await MikroORM.init({
        dbName: 'lired',
        type: 'postgresql',
        entities: [Post],
        debug: __prod__
    })
}



main()

