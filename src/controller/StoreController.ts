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

export const updateStore = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { id } = req.user;
    const { storeId } = req.params;

    const isStore = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!isStore) {
      return res.status(404).json({ message: "Loja não encontrada" });
    }

    if (id !== isStore.userId) {
      return res.status(400).json({ message: "Usuário não e dono desta Loja" });
    }

    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
      },
    });

    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { storeId } = req.params;

    const isStore = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    if (!isStore) {
      return res.status(404).json({ message: "Loja não encontrada" });
    }

    if (id !== isStore.userId) {
      return res.status(400).json({ message: "Usuário não e dono desta Loja" });
    }

    await prisma.store.delete({
      where: { id: storeId },
    });

    return res.status(200).json({ message: "Loja deletada com sucesso." });
  } catch (error) {
    return res.status(400).json(error);
  }
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

export const getUniqueStore = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;

    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
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

    if (!store) {
      return res.status(404).json({ message: "Loja não encontrada" });
    }

    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json(error);
  }
};
