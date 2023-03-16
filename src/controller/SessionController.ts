import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../database/prisma";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
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
        }
      },
    });

    if (!user) {
      return res.json({ error: "Usuário não encontrado!" });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ error: "Senha incorreta!" });
    }

    const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

    if (!MY_SECRET_KEY) {
      throw new Error("A chave secreta não foi definida corretamente");
    }

    // Gera o token de autenticação
    const token = sign(
      { userId: user.id, role: user.UserAccess.map(access => access.Access?.name) },
      MY_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error);
  }
};