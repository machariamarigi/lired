import { MikroORM } from "@mikro-orm/core";

import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

export default {  
    dbName: 'lired',
    type: 'postgresql',
    entities: [Post],
    debug: __prod__ 
} as Parameters<typeof MikroORM.init>[0]