export type { AppRouter } from "./routers";

import * as adapter from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { expressHandler } from "trpc-playground/handlers/express";

import { COOKIE_NAME, ONE_WEEK } from "./lib/constants";
import { createContext } from "./lib/context";
import { logger } from "./lib/logger";
import { appRouter } from "./routers";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: Bun.env.WEB_ORIGIN,
		credentials: true
	})
);
app.use(cookieParser());
app.use(
	session({
		name: COOKIE_NAME,
		secret: Bun.env.COOKIE_SECRET!,
		cookie: {
			maxAge: ONE_WEEK,
			sameSite: "lax"
		},
		saveUninitialized: false,
		resave: false
	})
);
app.use(
	"/api",
	adapter.createExpressMiddleware({
		router: appRouter,
		createContext
	})
);
app.use(
	"/playground",
	await expressHandler({
		trpcApiEndpoint: "/api",
		playgroundEndpoint: "/playground",
		router: appRouter,
		renderOptions: {
			cdnUrl: "https://cdn.jsdelivr.net/npm"
		}
	})
);

app.listen(parseInt(Bun.env.PORT!), () => {
	logger.info(`server started at http://localhost:${Bun.env.PORT}/api`);
	logger.info(
		`playground started at http://localhost:${Bun.env.PORT}/playground`
	);
});
