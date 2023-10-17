import { TRPCError } from "@trpc/server";
import z from "zod";

import { COOKIE_NAME } from "../lib/constants";
import db from "../lib/db";
import { procedure, router } from "../lib/trpc";
import { getUser } from "../lib/utils";

export const userRouter = router({
	me: procedure.query(async ({ ctx }) => {
		return await getUser(ctx);
	}),
	create: procedure
		.input(
			z.object({
				email: z.string(),
				password: z.string()
			})
		)
		.mutation(async ({ input }) => {
			const res = await db.query("SELECT id FROM users WHERE email = $1;", [
				input.email
			]);

			if (res.rowCount)
				throw new TRPCError({
					code: "CONFLICT"
				});

			const hash = await Bun.password.hash(input.password);

			await db.query("INSERT INTO users (email, password) VALUES ($1, $2);", [
				input.email,
				hash
			]);
		}),
	signIn: procedure
		.input(z.object({ email: z.string(), password: z.string() }))
		.query(async ({ input, ctx }) => {
			const res = await db.query(
				"SELECT id, password FROM users WHERE email = $1;",
				[input.email]
			);

			if (!res.rowCount)
				throw new TRPCError({
					code: "NOT_FOUND"
				});

			const user = res.rows[0];

			const verified = await Bun.password.verify(input.password, user.password);
			if (!verified)
				throw new TRPCError({
					code: "UNAUTHORIZED"
				});

			ctx.req.session.userId = user.id;
		}),
	signOut: procedure.query(async ({ ctx }) => {
		return new Promise(resolve =>
			ctx.req.session.destroy(err => {
				ctx.res.clearCookie(COOKIE_NAME);

				if (err) {
					resolve(false);
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR"
					});
				}
				resolve(true);
			})
		);
	}),
	toggleDarkMode: procedure.mutation(async ({ ctx }) => {
		const user = await getUser(ctx);

		await db.query("UPDATE users SET dark_mode = $1 WHERE id = $2;", [
			!user.dark_mode,
			ctx.req.session.userId
		]);

		return !user.dark_mode;
	})
});
