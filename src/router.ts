import { Router } from "express";

import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createProduct } from "./controller/ProductController";
import { signIn } from "./controller/SessionController";
import { createStore, getAllStore } from "./controller/StoreController";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controller/UserController";
import { authMiddleware } from "./middlewares/AuthMiddleware";

export const router = Router();

router.post("/user", createUser);
router.delete("/delete-users", authMiddleware(["adm"]), deleteManyUser);
router.get("/get-all-users", authMiddleware(["adm"]), getAllUser);

router.get(
  "/get-unique-user",
  authMiddleware(["adm", "Vendedor", "Comprador"]),
  getUniqueUser
);

router.post("/access", authMiddleware(["adm"]), createAccess);
router.get("/accesses", authMiddleware(["adm", "Vendedor"]), getAllAccesses);

router.post("/store", authMiddleware(["adm", "Vendedor"]), createStore);
router.get("/stores", getAllStore);

router.post(
  "/product/:storeId",
  authMiddleware(["adm", "Vendedor"]),
  createProduct
);

router.post("/sign-in", signIn);


