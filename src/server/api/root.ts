import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { attachmentRouter } from "./routers/attachment";
import { authRouter } from "./routers/auth";
import { settingRouter } from "./routers/settings";
import { templateRouter } from "./routers/template";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  attachment: attachmentRouter,
  auth: authRouter,
  setting: settingRouter,
  template: templateRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
