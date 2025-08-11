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

export type AccountInfo = {
	fullName: string;
	email: string;
	contactNumber: string;
	address: string;
};

export type PaymentMethod = {
	method: 'e-wallet' | 'card';
	holderName: string;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	ewallet: 'gcash' | 'paymaya' | 'grab_pay';
};
