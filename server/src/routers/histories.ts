import db from "../lib/db";
import { procedure, router } from "../lib/trpc";
import { getUser } from "../lib/utils";
import { History } from "../models";

export const historyRouter = router({
	mine: procedure.query(async ({ ctx }) => {
		const user = await getUser(ctx);

		const res = await db.query(
			"SELECT date, completed, total FROM histories WHERE user_id = $1;",
			[user.id]
		);

		return res.rows as History[];
	})
});
