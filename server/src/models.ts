export interface User {
	id: string;
	email: string;
	dark_mode: boolean;
	updated_on: Date;
}

export interface Atom {
	id: string;
	user_id: string;
	title: string;
	time_initial: number;
	time_current: number;
}
