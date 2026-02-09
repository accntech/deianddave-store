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
	selectedImage: { source: string; colorId: string };
	images: Array<{ source: string; colorId: string }>;
	info: Info | null;
	price: number;
	selectedSize: {
		id: string;
		name: string;
	} | null;
	sizes: Array<{
		id: string;
		name: string;
	}>;
	selectedColor: {
		id: string;
		name: string;
		hexCode: string;
	} | null;
	colors: Array<{
		id: string;
		name: string;
		hexCode: string;
	}>;
	available: number;
	quantity: number;
	aspectRatio: string;
	onColorChanged: (color: { id: string; name: string; hexCode: string }) => void;
	onSubmit: () => void;
};
