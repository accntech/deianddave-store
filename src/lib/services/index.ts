import type { InventoryItem } from './inventory';

export type Result<T> = {
	status: number;
	data: T;
	errors?: {
		id?: string;
		messages: string[];
		custom?: Record<string, string[]>;
	};
};

export type ErrorResult = {
	status: number;
	errors: {
		id?: string;
		messages: string[];
		custom?: Record<string, string[]>;
	};
};

export type Order = {
	quantity: number;
	item: InventoryItem;
};
