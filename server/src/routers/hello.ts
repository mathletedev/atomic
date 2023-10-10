import db from "../lib/db";
import { procedure } from "../lib/trpc";

export const helloRouter = procedure.query(async ({ ctx }) => {
	if (!ctx.req.session.userId) return "hello, world!";

	const res = await db.query("SELECT email FROM USERS WHERE id = $1;", [
		ctx.req.session.userId
	]);

	const user = res.rows[0];

	return `hello, ${user.email}!`;
});
