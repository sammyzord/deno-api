import { Router } from "https://deno.land/x/oak/mod.ts";
import { listUsers } from "./controller.ts";

const router = new Router();

router.get("/users", listUsers);

export default router;
