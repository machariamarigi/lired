import { Migration } from '@mikro-orm/migrations';

export class Migration20201028095320 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "username" text not null;');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
