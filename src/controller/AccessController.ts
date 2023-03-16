import { Request, Response } from "express";

import { prisma } from "../database/prisma";

export const createAccess = async (req: Request, res: Response) => {
  const { name } = req.body;

  const access = await prisma.access.create({
    data: { name },
  });

  return res.json(access);
};


export const getAllAccesses = async (req: Request, res: Response) => {

  const accesses = await prisma.access.findMany()

  return res.json(accesses);
};
