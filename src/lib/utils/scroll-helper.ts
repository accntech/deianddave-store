export const scrollOnFocus = (node: HTMLElement, active: boolean) => {
	function run() {
		if (active && typeof window !== 'undefined') {
			node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	}
	run();
	return {
		update(value: boolean) {
			active = value;
			run();
		}
	};
};
