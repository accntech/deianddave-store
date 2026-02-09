<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils';
	import { tick } from 'svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	> & { mask: string };
	let {
		ref = $bindable(null),
		mask = $bindable(''),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();

	function maskValue(value: string, maskPattern: string = mask) {
		let masked = '';
		let i = makeDigiter(value);
		if (!i.more) {
			return masked;
		}

		for (const m of maskPattern) {
			if (m === '9' && i.next()) {
				// consume digit
				masked += i.value;
			} else if (i.more) {
				// use mask character
				masked += m;
			} else {
				// ran out of digits
				break;
			}
		}
		return masked;
	}

	function makeDigiter(value: string) {
		const digits = getDigits(value);
		const { length } = digits;
		let i = 0;

		return {
			more: i < length,
			value: '',
			next() {
				if (this.more) {
					this.value = digits[i];
					i += 1;
					this.more = i < length;
					return true;
				} else {
					return false;
				}
			}
		};
	}

	function getDigits(value: string) {
		let digits = '';
		for (const c of value) {
			if (c >= '0' && c <= '9') {
				digits += c;
			}
		}
		return digits;
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const nativeEvent = event instanceof InputEvent ? event : undefined;
		const inputType = nativeEvent?.inputType;

		const {
			selectionStart: oldStart,
			selectionEnd: oldEnd,
			value: { length: oldLength }
		} = input;
		let [start, end] = [oldStart, oldEnd];
		value = fixIt(input, value, maskValue(input.value));
		const { length } = value;
		switch (inputType) {
			case 'insertText':
			case 'insertFromPaste':
			case 'insertReplacementText':
			case 'insertFromDrop':
				const adjust = length - oldLength;
				if (adjust > 0 && start) {
					start += adjust;
				} else if (start && isRightOfMask(start)) {
					start += 1;
				}
				break;
			case 'deleteContentBackward':
				if (start && isRightOfMask(start)) {
					start -= 1;
				}
				break;
			case 'deleteContentForward':
				if (start && start === length && isRightOfMask(start)) {
					start -= 1;
				}
				break;
		}
		if (oldStart === oldEnd) {
			end = start;
		}
		queueRestoreSelection(input, start, end);
	}

	// Keep value masked when `value` or `mask` changes externally (programmatic updates/autofill)
	$effect(() => {
		const v: string = value == null ? '' : String(value);
		const sanitized = maskValue(v, mask);
		if (sanitized !== v) {
			value = sanitized;
		}
	});

	async function queueRestoreSelection(
		input: HTMLInputElement,
		start: number | null,
		end: number | null
	) {
		await tick();
		input.setSelectionRange(start, end);
	}

	function isRightOfMask(position: number | null) {
		if (position === null) return false;
		return position > 1 && mask[position - 1] !== '9';
	}

	function fixIt(input: HTMLInputElement, state: string, sanitized: string) {
		if (state === sanitized && sanitized !== input.value) {
			input.value = sanitized;
		}
		return sanitized;
	}
</script>

<input
	bind:this={ref}
	maxlength={mask.length}
	oninput={handleInput}
	onchange={handleInput}
	data-slot="input"
	class={cn(
		'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
		'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
		'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
		className
	)}
	{type}
	bind:value
	{...restProps}
/>
