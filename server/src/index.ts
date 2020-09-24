import { MikroORM } from "@mikro-orm/core";
import MikroORMConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(MikroORMConfig)
    await orm.getMigrator().up()

}

main().catch(err => console.log(err))
