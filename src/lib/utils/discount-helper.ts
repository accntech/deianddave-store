import type { Discount } from '$lib/services';

export const computeDiscount = (total: number, discount: Discount | undefined) => {
	if (!discount) return 0;

	if (discount.type === 'percentage') {
		return (total * discount.value) / 100;
	} else if (discount.type === 'fixed') {
		return discount.value;
	}
	return 0;
};
