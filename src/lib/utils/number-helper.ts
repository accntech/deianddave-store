export function splitNumberToString(value: number) {
	const wholeNumber = Math.floor(value);
	const decimal = Math.round((value - wholeNumber) * 100) / 100;

	return {
		wholeNumber: wholeNumber.toLocaleString(),
		decimal: decimal.toFixed(2).split('.')[1]
	};
}
