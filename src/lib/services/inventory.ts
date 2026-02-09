export type InventoryItem = {
	id: string;
	type: string;
	product: {
		id: string;
		index: number;
		name: string;
		description: string | null;
		image: string | null;
	};
	sets: Array<{
		id: string;
		index: number;
		name: string;
		itemId: string;
		quantity: number;
	}>;
	fabric: {
		id: string;
		index: number;
		name: string;
	};
	ageGroup: {
		id: string;
		index: number;
		name: string;
	} | null;
	genderGroup: {
		id: string;
		index: number;
		name: string;
	} | null;
	color: {
		id: string;
		index: number;
		name: string;
		hexCode: string;
	};
	size: {
		id: string;
		index: number;
		name: string;
	};
	price: number;
	quantity: number;
	image?: string;
	status: 'active' | 'inactive' | 'on_hold';
	defaultItem: boolean;
};

export type Product = {
	id: string;
	type: string;
	product: {
		id: string;
		index: number;
		name: string;
		description: string | null;
		image: string | null;
	};
	sets: Array<{
		id: string;
		index: number;
		name: string;
		quantity: number;
	}>;
	fabric: {
		id: string;
		index: number;
		name: string;
	};
	ageGroup: {
		id: string;
		index: number;
		name: string;
	} | null;
	genderGroup: {
		id: string;
		index: number;
		name: string;
	} | null;
	price: number;
	image?: string;
	status: 'active' | 'inactive' | 'on_hold';
	defaultItem: boolean;
};
