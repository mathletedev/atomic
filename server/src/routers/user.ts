import z from "zod";

import { COOKIE_NAME } from "../lib/constants";
import db from "../lib/db";
import { procedure, router } from "../lib/trpc";

export const userRouter = router({
	me: procedure.query(async ({ ctx }) => {
		if (!ctx.req.session.userId) return "not signed in";

		const res = await db.query("SELECT * FROM users WHERE id = $1;", [
			ctx.req.session.userId
		]);

		if (!res.rows) return "unable to find user";

		return res.rows[0];
	}),
	create: procedure
		.input(
			z.object({
				email: z.string(),
				password: z.string()
			})
		)
		.mutation(async ({ input }) => {
			let res = await db.query("SELECT * FROM USERS WHERE email = $1;", [
				input.email
			]);

			if (res.rowCount) return "user already exists";

			const hash = await Bun.password.hash(input.password);

			res = await db.query(
				"INSERT INTO users (email, password) VALUES ($1, $2);",
				[input.email, hash]
			);
		}),
	signIn: procedure
		.input(z.object({ email: z.string(), password: z.string() }))
		.query(async ({ input, ctx }) => {
			const res = await db.query(
				"SELECT id, password FROM USERS WHERE email = $1;",
				[input.email]
			);

			if (!res.rowCount) return "invalid email or password";

			const user = res.rows[0];

			const verified = await Bun.password.verify(input.password, user.password);
			if (!verified) return "invalid email or password";

			ctx.req.session.userId = user.id;
		}),
	signOut: procedure.query(async ({ ctx }) => {
		return new Promise(resolve =>
			ctx.req.session.destroy(err => {
				ctx.res.clearCookie(COOKIE_NAME);

				if (err) {
					console.log(err);
					resolve(false);
					return;
				}
				resolve(true);
			})
		);
	})
});
