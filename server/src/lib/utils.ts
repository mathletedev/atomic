import { TRPCError } from "@trpc/server";

import { ExpressRequest } from "./context";
import db from "./db";

export const getUser = async (ctx: ExpressRequest) => {
	if (!ctx.req.session.userId)
		throw new TRPCError({
			code: "UNAUTHORIZED"
		});

	const res = await db.query("SELECT * FROM users WHERE id = $1;", [
		ctx.req.session.userId
	]);

	if (!res.rows)
		throw new TRPCError({
			code: "NOT_FOUND"
		});

	return res.rows[0];
};
