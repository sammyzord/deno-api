import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { listUsers, userDetails } from "./controller.ts";

const router = new Router();

router.get("/users", listUsers);
router.get("/users/:username", userDetails);

export default router;
