import { trpc } from "$lib/trpc";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
	let darkMode;

	try {
		darkMode = await trpc.user.darkMode.query();
	} catch (err) {
		darkMode = false;
	}

	return {
		darkMode
	};
};
