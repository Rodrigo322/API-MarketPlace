import { Router } from "express";

import { createAccess, getAllAccesses } from "./controller/AccessController";
import { createProduct } from "./controller/ProductController";
import { createStore, getAllStore } from "./controller/StoreController";
import { createUser, deleteManyUser, getAllUser } from "./controller/UserController";

export const router = Router();

router.post("/user", createUser);
router.delete("/delete-users", deleteManyUser);
router.get("/get-all-users", getAllUser);

router.post("/access", createAccess);
router.get("/accesses", getAllAccesses);

router.post("/store/:userId", createStore);
router.get("/stores", getAllStore);

router.post("/product/:storeId", createProduct);


