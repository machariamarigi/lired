import { MikroORM } from "@mikro-orm/core";
import MikroORMConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
}

main()
