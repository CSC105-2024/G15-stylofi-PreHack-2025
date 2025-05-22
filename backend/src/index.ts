import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { mainRouter } from "./routes/index.route.ts";
import dotenv from "dotenv";
dotenv.config();

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
  }),
);

app.route("", mainRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
