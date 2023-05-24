import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, OneToMany } from "typeorm";
import { AuthService } from "../services/AuthService";
import { Blog } from "./Blog";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(["username"])
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];
  
  @BeforeInsert()
  async hashPassword() {
    this.password = await AuthService.hashPassword(this.password);
  }

  checkPassword(password: string) {
    return AuthService.checkPassword(password, this.password);
  }

  generateToken() {
    const { id, username } = this;
    return AuthService.generateToken({ id, username });
  }
}
