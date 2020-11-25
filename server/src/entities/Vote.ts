import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Vote extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number

    @ManyToMany(() => User, user => user.votes)
    user: User

    @PrimaryColumn()
    postId: number

    @ManyToMany(() => Post, post => post.votes)
    post: Post
}
