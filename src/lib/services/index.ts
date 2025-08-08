export type Result<T> = {
	status: number;
	data: T;
	errors?: {
		id?: string;
		messages?: string[];
		custom?: Record<string, string[]>;
	};
};
