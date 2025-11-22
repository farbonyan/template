import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { settingRouter } from "./routers/settings";
import { templateRouter } from "./routers/template";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  setting: settingRouter,
  template: templateRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
