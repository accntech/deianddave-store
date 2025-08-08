//exported from https://github.com/skeletonlabs/skeleton
// Action: Focus Trap
export function focusTrap(node: HTMLElement) {
	const elemWhitelist =
		'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';
	let elemFirst: HTMLElement;
	let elemLast: HTMLElement;

	// When the first element is selected, shift+tab pressed, jump to the last selectable item.
	function onFirstElemKeydown(e: KeyboardEvent): void {
		if (e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemLast.focus();
		}
	}

	// When the last item selected, tab pressed, jump to the first selectable item.
	function onLastElemKeydown(e: KeyboardEvent): void {
		if (!e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemFirst.focus();
		}
	}

	// Sort focusable elements by tabindex, positive first, then 0
	const sortByTabIndex = (focusableElements: HTMLElement[]): HTMLElement[] => {
		return focusableElements
			.filter((elem) => elem.tabIndex >= 0)
			.sort((a, b) => {
				if (a.tabIndex === 0 && b.tabIndex > 0)
					return 1; // Move 0 to end of array
				else if (a.tabIndex > 0 && b.tabIndex === 0)
					return -1; // Move 0 to end of array
				else return a.tabIndex - b.tabIndex; // Sort non-zero values in ascending order
			});
	};

	type FocusIndexElement = HTMLElement & { dataset: { focusIndex: string } };

	const getFocusTrapTarget = (firstElement: HTMLElement) => {
		const focusIndexElements = [...node.querySelectorAll<FocusIndexElement>('[data-focusindex]')];
		if (!focusIndexElements || focusIndexElements.length === 0) return firstElement;

		return (
			focusIndexElements.sort((a, b) => {
				return +a.dataset.focusIndex - +b.dataset.focusIndex;
			})[0] || firstElement
		);
	};

	const onScanElements = (fromObserver: boolean) => {
		// Gather all focusable elements, sorted according to tabindex
		const focusableElements: HTMLElement[] = sortByTabIndex(
			Array.from(node.querySelectorAll(elemWhitelist))
		);

		if (focusableElements.length) {
			// Set first/last focusable elements
			elemFirst = focusableElements[0];
			elemLast = focusableElements[focusableElements.length - 1];
			// Auto-focus focusTrapTarget or first focusable element only when not called from observer
			if (!fromObserver) getFocusTrapTarget(elemFirst).focus();
			// Listen for keydown on first & last element
			elemFirst.addEventListener('keydown', onFirstElemKeydown);
			elemLast.addEventListener('keydown', onLastElemKeydown);
		}
	};
	onScanElements(false);

	function onCleanUp(): void {
		if (elemFirst) elemFirst.removeEventListener('keydown', onFirstElemKeydown);
		if (elemLast) elemLast.removeEventListener('keydown', onLastElemKeydown);
	}

	// When children of node are changed (added or removed)
	const onObservationChange = (mutationRecords: MutationRecord[], observer: MutationObserver) => {
		if (mutationRecords.length) {
			onCleanUp();
			onScanElements(true);
		}
		return observer;
	};
	const observer = new MutationObserver(onObservationChange);
	observer.observe(node, { childList: true, subtree: true });

	// Lifecycle
	return {
		update() {
			onScanElements(false);
		},
		destroy() {
			onCleanUp();
			observer.disconnect();
		}
	};
}
