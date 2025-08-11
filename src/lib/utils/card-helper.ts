export const getCardType = (cardNumber: string) => {
	const cleaned = cardNumber.replace(/\s/g, '');
	const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/;
	const masterCardRegex =
		/^(5[1-5][0-9]{14}|2(?:22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;

	if (visaRegex.test(cleaned)) {
		return 'visa';
	} else if (masterCardRegex.test(cleaned)) {
		return 'master-card';
	} else {
		return 'not-supported';
	}
};

const isValidLuhn = (cardNumber: string) => {
	let sum = 0;
	for (let i = 0; i < cardNumber.length; i++) {
		let digit = parseInt(cardNumber[cardNumber.length - 1 - i]);
		if (i % 2 === 1) {
			// Double every second digit from the right
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}
		sum += digit;
	}
	return sum % 10 === 0;
};

export const tryParseCardNumber = (cardNumber: string) => {
	const cardType = getCardType(cardNumber);
	if (cardType === 'not-supported') {
		return { success: false, card: null };
	}
	return { success: isValidLuhn(cardNumber), card: { type: cardType, number: cardNumber } };
};

export const tryParseCardDate = (dateString: string) => {
	const [month, year] = dateString.split('/').map(Number);
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;
	const fullYear = 2000 + year;

	if (month < 1 || month > 12) {
		return { success: false, date: { month: 0, year: 0 } };
	}

	if (fullYear < currentYear || fullYear > currentYear + 10) {
		return { success: false, date: { month, year } };
	}

	if (fullYear === currentYear && month <= currentMonth) {
		return { success: false, date: { month: 0, year: 0 } };
	}

	return { success: true, date: { month, year } };
};

export const tryParseCvv = (cvv: string) => {
	const regex = /^[0-9]{3,4}$/;
	const isValid = regex.test(cvv);

	return {
		success: isValid,
		value: isValid ? cvv : null
	};
};

export const maskCardNumber = (cardNumber: string) => {
	const cleaned = cardNumber.replace(/\s/g, '');

	const len = cleaned.length;

	const result: string[] = [];

	for (let i = 0; i < len; i++) {
		if (i < len - 4) {
			result.push('*');
		} else {
			result.push(cleaned[i]);
		}
		if ((i + 1) % 4 === 0 && i !== len - 1) {
			result.push(' ');
		}
	}

	return result.join('');
};
