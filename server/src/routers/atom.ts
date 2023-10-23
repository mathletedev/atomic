import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import db from "../lib/db";
import { procedure, router } from "../lib/trpc";
import { getUser } from "../lib/utils";
import { Atom } from "../models";

export const atomRouter = router({
	mine: procedure.query(async ({ ctx }) => {
		const user = await getUser(ctx);

		const res = await db.query(
			"SELECT id, title, EXTRACT(epoch FROM time_current) as time_current FROM atoms WHERE user_id = $1;",
			[user.id]
		);

		return res.rows.map(
			({ id, title, time_current }) =>
				({ id, title, time_current: parseFloat(time_current) }) as Atom
		);
	}),
	create: procedure
		.input(z.object({ title: z.string(), time: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await getUser(ctx);

			await db.query(
				"INSERT INTO atoms (id, user_id, title, time_initial, time_current) VALUES ($1, $2, $3, $4 * interval '1 min', $4 * interval '1 min');",
				[uuid(), user.id, input.title, input.time]
			);
		}),
	delete: procedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const user = await getUser(ctx);

			const res = await db.query(
				"SELECT title FROM atoms WHERE id = $1 AND user_id = $2;",
				[input.id, user.id]
			);

			if (!res.rowCount)
				throw new TRPCError({
					code: "NOT_FOUND"
				});

			await db.query("DELETE FROM atoms WHERE id = $1", [input.id]);
		}),
	updateTime: procedure
		.input(z.object({ id: z.string(), time: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const user = await getUser(ctx);

			const res = await db.query("SELECT user_id FROM atoms WHERE id = $1;", [
				input.id
			]);

			if (!res.rowCount)
				throw new TRPCError({
					code: "NOT_FOUND"
				});

			if (user.id != res.rows[0].user_id)
				throw new TRPCError({ code: "UNAUTHORIZED" });

			await db.query(
				"UPDATE atoms SET time_current = $1 * interval '1 sec' WHERE id = $2;",
				[input.time, input.id]
			);
		})
});
