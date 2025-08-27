export type Info = {
	id: string;
	product: {
		id: string;
		index: number;
		name: string;
		description: string | null;
		image: string | null;
	};
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
};

export type Props = {
	selectedImage: string;
	images: string[];
	info: Info;
	price: number;
	selectedSize: {
		id: string;
		name: string;
	};
	sizes: Array<{
		id: string;
		name: string;
	}>;
	selectedColor: {
		id: string;
		name: string;
		hexCode: string;
	};
	colors: Array<{
		id: string;
		name: string;
		hexCode: string;
	}>;
	available: number;
	quantity: number;
	onSubmit: () => void;
};
