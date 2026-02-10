import type { PageServerLoad } from './$types';
import testimonials from '$lib/assets/testimonials.json';

export const load: PageServerLoad = async () => {
	const shuffled = [...testimonials].sort(() => Math.random() - 0.5);
	return { testimonials: shuffled.slice(0, 5) };
};
