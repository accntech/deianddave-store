export function splitNumberToString(value: number) {
	const wholeNumber = Math.floor(value);
	const decimal = Math.round((value - wholeNumber) * 100) / 100;

	return {
		wholeNumber: wholeNumber.toLocaleString(),
		decimal: decimal.toFixed(2).split('.')[1]
	};
}

/**Format price to Philippine Peso */
export const toPeso = (price: number) => {
	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP'
	}).format(price);
};

export const toDecimalString = (value: number, locals?: string) => {
	if (!locals) locals = 'en-US';

	return new Intl.NumberFormat(locals, {
		style: 'decimal',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
};
