import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken {
  userId: string;
}

export function authMiddleware(permissions?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
    
    const token = authHeader.substring(7);

    try {
      const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

      if (!MY_SECRET_KEY) {
        throw new Error("A chave secreta não foi definida corretamente");
      }
      const decodedToken = verify(token, MY_SECRET_KEY) as DecodedToken;

      req.user = { id: decodedToken.userId };

      // Verifica as permissões do usuário
      if (permissions) {
        const user = await prisma.user.findUnique({
          where: {
            id: decodedToken.userId,
          },
          include: {
            UserAccess: {
              select: {
                Access: {
                  select: {
                    name: true
                  }
                }
              }
            },
          },
        });
        const userPermissions = user?.UserAccess.map((na) => na.Access?.name) ?? [];
        const hasPermission = permissions.some((p) =>
          userPermissions.includes(p)
        );
        if (!hasPermission) {
          return res.status(403).json({ message: "Permissão negada" });
        }
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}