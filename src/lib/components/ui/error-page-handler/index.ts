import ErrorPageHandler from './error-page-handler.svelte';

export type ErrorResult = {
	status: number;
	errors?: {
		id?: string;
		messages?: string[];
		custom?: Record<string, string[]>;
	};
};

export { ErrorPageHandler };
