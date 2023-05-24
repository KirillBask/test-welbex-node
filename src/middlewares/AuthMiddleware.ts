import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { jwtConfig } from "../configs/jwtConfig";
import { AppDataSource } from "../data/data-source";

export interface CustomRequest extends Request {
  currentUser?: User;
}

export const AuthMiddleware = (
  handler: (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decodedToken = jwt.verify(token, jwtConfig.secret) as any;
      const userId = decodedToken.id;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.currentUser = user;
      await handler(req, res, next);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
