import { Response, NextFunction } from "express";
import { AppDataSource } from "../data/data-source";
import { Blog } from "../entities/Blog";
import { CustomRequest } from "../middlewares/AuthMiddleware";
import { User } from "../entities/User";

export class BlogController {
  private blogRepository = AppDataSource.getRepository(Blog);

  async createBlog(req: CustomRequest, res: Response) {
    const { message } = req.body;
    const { currentUser } = req;

    const blog = Object.assign(new Blog(), {
      message,
      author: currentUser,
    });

    await this.blogRepository.save(blog);

    return res.status(201).json({ message: "Blog post created successfully" });
  }

  async getBlogs(req: CustomRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const [blogs, total] = await this.blogRepository.findAndCount({
      relations: ["author"],
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });
    return res.status(200).json({ blogs, total });
  }

  async updateBlog(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }
    const { message } = req.body;
    const { currentUser } = req;

    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    if (blog.author.id !== currentUser.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    blog.message = message;
    await this.blogRepository.save(blog);

    return res.status(200).json({ message: "Blog post updated successfully" });
  }

  async deleteBlog(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }
    const { currentUser } = req;
    console.log("currentUser:", currentUser instanceof User, currentUser);
    const blog = await this.blogRepository.findOne({ where: { id }, relations: ["author"] });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    console.log(currentUser.id);
    console.log(blog);
    if (blog.author.id !== currentUser.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
 
    await this.blogRepository.remove(blog);

    return res.status(200).json({ message: "Blog post deleted successfully" });
  }
}
