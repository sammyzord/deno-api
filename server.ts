import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import router from "./routes.ts";

const app = new Application();

app.use(oakCors());

app.use(router.routes());

const port = Deno.env.get("PORT") || "8080";

await app.listen({ port: Number(port) });
