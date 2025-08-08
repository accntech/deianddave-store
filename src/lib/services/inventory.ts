export type InventoryItem = {
	id: string;
	type: string;
	productId: string;
	productName: string;
	productDescription: string;
	productImage: string;
	productSets: Array<{
		id: string;
		name: string;
		quantity: number;
	}>;
	fabricId: string;
	fabricName: string;
	ageGroupId: string;
	ageGroupName: string;
	genderGroupId: string;
	genderGroupName: string;
	colorId: string;
	colorName: string;
	hexCode: string;
	sizeId: string;
	sizeName: string;
	price: number;
	quantity: number;
	image?: string;
	status: 'active' | 'inactive' | 'on_hold';
};

export type Product = {
	id: string;
	type: string;
	productId: string;
	productName: string;
	productDescription: string;
	productImage: string;
	productSets: Array<{
		id: string;
		name: string;
		quantity: number;
	}>;
	fabricId: string;
	fabricName: string;
	ageGroupId: string;
	ageGroupName: string;
	genderGroupId: string;
	genderGroupName: string;
	price: number;
	image?: string;
	status: 'active' | 'inactive' | 'on_hold';
};
