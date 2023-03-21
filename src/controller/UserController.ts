import { hash } from "bcryptjs";
import { Request, Response } from "express";

import { prisma } from "../database/prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, accessName } = req.body;

    const isUserUniqueEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const isAccessName = await prisma.access.findUnique({
      where: {
        name: accessName,
      },
    });

    if (!isAccessName) {
      return res
        .status(400)
        .json({ message: "Esté nivel de acesso não existe" });
    }

    if (isUserUniqueEmail) {
      return res
        .status(400)
        .json({ message: "Já existe um usuário com este email" });
    }

    const hashPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        userAccess: {
          create: {
            Access: {
              connect: {
                name: accessName,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteManyUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.deleteMany();

    return res.status(200).json({ message: "Usuário deletados" });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if(!users) {
      return res.status(204)
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getUniqueUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.user

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if(!user) {
      return res.status(204)
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};
