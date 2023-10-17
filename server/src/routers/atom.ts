import { z } from "zod";

import db from "../lib/db";
import { procedure, router } from "../lib/trpc";
import { getUser } from "../lib/utils";
import { Atom } from "../models/atom";
import { TRPCError } from "@trpc/server";

export const atomRouter = router({
	mine: procedure.query(async ({ ctx }) => {
		const user = await getUser(ctx);

		const res = await db.query(
			"SELECT id, title, EXTRACT(epoch FROM time) as time FROM atoms WHERE user_id = $1;",
			[user.id]
		);

		return res.rows.map(
			({ id, title, time }) => ({ id, title, time: parseFloat(time) }) as Atom
		);
	}),
	create: procedure
		.input(z.object({ title: z.string(), time: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await getUser(ctx);

			await db.query(
				"INSERT INTO atoms (user_id, title, time) VALUES ($1, $2, $3 * interval '1 sec');",
				[user.id, input.title, input.time]
			);
		}),
	delete: procedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await getUser(ctx);

			const res = await db.query("SELECT user_id FROM atoms WHERE id = $1", [
				input.id
			]);

			if (!res.rowCount)
				throw new TRPCError({
					code: "NOT_FOUND"
				});

			if (user.id != res.rows[0].user_id)
				throw new TRPCError({ code: "UNAUTHORIZED" });

			await db.query("DELETE FROM atoms WHERE id = $1", [input.id]);
		})
});
