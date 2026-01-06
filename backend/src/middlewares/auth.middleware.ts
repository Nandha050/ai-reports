import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        orgId: string;
      };
    }
  }
}

/**
 * Simple auth middleware for development/testing
 * In production, this should validate JWT tokens against an auth service
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // For now, we'll accept Authorization header with format: Bearer <userId>:<orgId>:<email>
    // In production, this would validate a JWT token

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);

    // Simple demo token format: userId:orgId:email
    // In production: validate JWT signature and claims
    const parts = token.split(":");

    if (parts.length < 3) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const [userId, orgId, email] = parts;

    if (!userId || !orgId || !email) {
      return res.status(401).json({ message: "Invalid token claims" });
    }

    // Attach user to request
    req.user = {
      userId,
      email,
      orgId
    };

    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

/**
 * Optional auth middleware - allows request to proceed with or without auth
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const parts = token.split(":");

      if (parts.length >= 3) {
        const [userId, orgId, email] = parts;
        req.user = { userId, orgId, email };
      }
    }

    next();
  } catch (error) {
    // Continue without user
    next();
  }
};
