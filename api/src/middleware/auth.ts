import { Response, NextFunction } from "express";
import dotenv from "dotenv";

if (!process.env.ENVIRONMENT_NAME) {
  dotenv.config();
}

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  req.isAuth = false;
  let error = false

  const authHeader = req.get("Authorization");

  if (authHeader) {
    const token: string = authHeader.split(" ")[1].replace(/"/g, "");

    const validApiToken = /^[a-z0-9]{16}$/.exec(token)
    if (!validApiToken) {
      error = true
    }
  }
  else {
    error = true
  }
  if (error) {
    throw new Error("APiToken received is not valid.")
  }
  next();
};

export default authMiddleware;
