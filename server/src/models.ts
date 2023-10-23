export interface User {
	id: string;
	email: string;
	dark_mode: boolean;
}

export interface Atom {
	id: string;
	title: string;
	time_initial: number;
	time_current: number;
}

export interface History {
	date: string;
	completed: number;
	total: number;
}
