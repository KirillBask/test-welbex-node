import { AppDataSource } from "../data/data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { validationResult } from 'express-validator';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all() {
    return this.userRepository.find();
  }

  async one(request: Request) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

 async registration(request: Request, response: Response) {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ message: 'Missing or invalid data', errors: errors.array() });
    }

    const { username, password } = request.body;

    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      return response.status(400).json({ message: "Username already taken" });
    }

    const user = Object.assign(new User(), {
      username,
      password,
    });

    await this.userRepository.save(user);

    return response.json({ message: 'User has been registered' });
  } catch (e) {
    response.status(400).json({ message: 'Registration error' });
  }
}

  async login(request: Request, response: Response) {
    const { username, password } = request.body;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !user.checkPassword(password)) {
      return response.status(401).json({ message: "Invalid username or password" });
    }
    const token = user.generateToken();

    return response.status(200).json({ token });
  }

  async remove(request: Request, response: Response) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return response.status(401).json({ message: "This user not exist" });
    }

    await this.userRepository.remove(userToRemove);
    return "User has been removed";
  }
}
