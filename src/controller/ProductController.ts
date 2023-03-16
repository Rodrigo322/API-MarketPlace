import { Request, Response } from "express";

import { prisma } from "../database/prisma";

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, amount } = req.body;
  const {storeId} = req.params;

  const Product = await prisma.product.create({
    data: { name, price, amount, Store: {
      connect: {
        id: storeId
      }
    } },
  });

  return res.json(Product);
};


export const getAllProducts = async (req: Request, res: Response) => {

  const Products = await prisma.product.findMany()

  return res.json(Products);
};
