import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createStore = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.user;

  const isUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUser) {
    return res.status(400).json({ message: "Usuário não existe" });
  }

  const store = await prisma.store.create({
    data: {
      name,
      User: {
        connect: {
          id,
        },
      },
    },
  });

  return res.json(store);
};

export const getAllStore = async (req: Request, res: Response) => {
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      User: {
        select: {
          name: true,
        },
      },
      Product: {
        select: {
          id: true,
          name: true,
          price: true,
          amount: true,
        },
      },
    },
  });
  return res.json(stores);
};
