import jwt from "jsonwebtoken";
import { Request, Response, NextFunction} from 'express';

declare global {
    namespace Express {
      interface Request {
        userId?: string;
        userRole: "user" | "admin";
      }
    }
  }

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string,role: "user" | "admin"; };
        req.userId = verified.id;
        req.userRole = verified.role;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authenticateToken;