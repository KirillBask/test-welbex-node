import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwtConfig";

export class AuthService {
  static generateToken(payload: any) {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: "1d" });
  };

  static checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  };

  static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  };
};