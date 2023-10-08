import z from "zod";

import db from "../lib/db";
import { procedure, router } from "../lib/trpc";

export const userRouter = router({
	list: procedure.query(async () => {
		const res = await db.query("SELECT * FROM users;");
		return res.rows;
	}),
	create: procedure
		.input(
			z.object({
				email: z.string(),
				password: z.string()
			})
		)
		.mutation(async ({ input }) => {
			const hash = await Bun.password.hash(input.password);

			await db.query("INSERT INTO users (email, password) VALUES ($1, $2);", [
				input.email,
				hash
			]);
		}),
	login: procedure
		.input(z.object({ email: z.string(), password: z.string() }))
		.query(async ({ input }) => {
			const res = await db.query(
				"SELECT password FROM USERS WHERE email = $1;",
				[input.email]
			);

			if (!res.rowCount) return "invalid email or password";

			const verified = await Bun.password.verify(
				input.password,
				res.rows[0].password
			);
			if (!verified) return "invalid email or password";

			return "logged in!";
		})
});
