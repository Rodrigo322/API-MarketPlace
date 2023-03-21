import { Router } from "express";

import { createAccess, getAllAccesses } from "./controller/AccessController";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getUniqueProduct,
  updateProduct,
} from "./controller/ProductController";
import {
  createSale,
  getAllSales,
  getAllSalesByBuyer,
  getAllSalesBySeller,
} from "./controller/SaleController";
import { signIn } from "./controller/SessionController";
import {
  createStore,
  getAllStore,
  updateStore,
} from "./controller/StoreController";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controller/UserController";
import { authMiddleware } from "./middlewares/AuthMiddleware";

export const router = Router();

/**
 * Rotas do usuário
 */
router.post("/user", createUser);
router.delete("/delete-users", authMiddleware(["adm"]), deleteManyUser);
router.get("/get-all-users", authMiddleware(["adm"]), getAllUser);
router.get(
  "/get-unique-user",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueUser
);

/**
 * Rotas de acessos
 */
router.post("/access", authMiddleware(["adm"]), createAccess);
router.get("/accesses", authMiddleware(["adm", "Vendedor"]), getAllAccesses);

/**
 * Rotas da loja
 */
router.post("/store", authMiddleware(["adm", "Vendedor"]), createStore);
router.get(
  "/stores",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getAllStore
);
router.put(
  "/update-store/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  updateStore
);

/**
 * Rotas do produto
 */
router.post(
  "/product/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  createProduct
);
router.get(
  "/products",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getAllProducts
);
router.put(
  "/update-product/:productId",
  authMiddleware(["adm", "Vendedor"]),
  updateProduct
);
router.get(
  "/get-unique-product/:productId",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueProduct
);
router.delete(
  "/delete-product/:productId",
  authMiddleware(["adm", "Vendedor"]),
  deleteProduct
);

/**
 * Rotas de autenticação
 */
router.post("/sign-in", signIn);

/**
 * Rotas da venda
 */
router.post(
  "/create-sale",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  createSale
);
router.get("/get-all-sales", authMiddleware(["adm"]), getAllSales);
router.get(
  "/get-all-sales-by-buyer",
  authMiddleware(["adm", "Comprador"]),
  getAllSalesByBuyer
);
router.get(
  "/get-all-sales-by-seller",
  authMiddleware(["adm", "Vendedor"]),
  getAllSalesBySeller
);
