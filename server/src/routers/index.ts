import { router } from "../lib/trpc";
import { atomRouter } from "./atom";
import { helloRouter } from "./hello";
import { historyRouter } from "./histories";
import { userRouter } from "./user";

export const appRouter = router({
	hello: helloRouter,
	user: userRouter,
	atom: atomRouter,
	histories: historyRouter
});

export type AppRouter = typeof appRouter;
