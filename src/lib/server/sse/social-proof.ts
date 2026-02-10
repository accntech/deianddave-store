import { INVENTORIES_URL } from '$env/static/private';
import type { Result } from '$lib/services';
import type { InventoryItem } from '$lib/services/inventory';
import { generateJWT } from '$lib/utils/jwt-generator';

const FAKE_NAMES = [
	'John',
	'Maria',
	'Anna',
	'Carlos',
	'Sofia',
	'James',
	'Elena',
	'Marco',
	'Linda',
	'David',
	'Grace',
	'Paolo',
	'Diana',
	'Miguel',
	'Sarah',
	'Angela',
	'Rico',
	'Bea',
	'Mark',
	'Joy',
	'Trisha',
	'Rafael',
	'Camille',
	'Jerome',
	'Nicole',
	'Patrick',
	'Karen',
	'Dennis',
	'April',
	'Bryan',
	'Cherry',
	'Ryan',
	'Jasmine',
	'Kevin',
	'Bianca',
	'Raymond',
	'Hannah',
	'Christian',
	'Arianne',
	'Justin',
	'Megan',
	'Gabriel',
	'Katrina',
	'Aaron',
	'Denise',
	'Andrei',
	'Yvonne',
	'Neil',
	'Kristine',
	'Leo'
];

const CYCLE_MS = 30 * 60 * 1000;
const TOASTS_PER_CYCLE = 5;

type Emitter = (event: string, data: string) => { error: false | Error };

const clients = new Set<Emitter>();
let productNames: string[] = [];
let schedulerRunning = false;
let cycleTimer: ReturnType<typeof setTimeout> | null = null;
const toastTimers: ReturnType<typeof setTimeout>[] = [];

function maskName(name: string): string {
	if (name.length <= 2) return name;
	if (name.length >= 5) {
		return name.slice(0, 2) + '*'.repeat(name.length - 3) + name.slice(-1);
	}
	return name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchProductNames(): Promise<string[]> {
	const jwt = await generateJWT();
	const results = await Promise.all(
		['beddings', 'loungewear'].map(async (type) => {
			const res = await fetch(`${INVENTORIES_URL}/?type=${type}`, {
				headers: {
					Authorization: `Bearer ${jwt}`,
					'Content-Type': 'application/json'
				}
			});
			if (!res.ok) return [];
			const result: Result<InventoryItem[]> = await res.json();
			return result.data ?? [];
		})
	);

	const activeItems = results.flat().filter((i) => i.status === 'active');
	return [...new Set(activeItems.map((i) => i.product.name))];
}

function broadcast(event: string, data: string) {
	for (const emit of clients) {
		const { error } = emit(event, data);
		if (error) clients.delete(emit);
	}
}

function showToast() {
	if (productNames.length === 0 || clients.size === 0) return;

	const product = pickRandom(productNames);
	const name = maskName(pickRandom(FAKE_NAMES));
	const qty = randomInt(1, 3);

	broadcast('social-proof', JSON.stringify({ name, product, qty }));
}

function scheduleCycle() {
	const MIN_GAP = 5 * 60 * 1000;
	const slack = CYCLE_MS - (TOASTS_PER_CYCLE - 1) * MIN_GAP;
	const delays = Array.from({ length: TOASTS_PER_CYCLE }, () =>
		Math.floor(Math.random() * slack)
	)
		.sort((a, b) => a - b)
		.map((d, i) => d + i * MIN_GAP);

	for (const delay of delays) {
		toastTimers.push(setTimeout(() => showToast(), delay));
	}

	cycleTimer = setTimeout(() => scheduleCycle(), CYCLE_MS);
}

async function startScheduler() {
	if (schedulerRunning) return;
	schedulerRunning = true;

	try {
		productNames = await fetchProductNames();
	} catch {
		// silently fail — no toasts if products can't be fetched
	}

	if (productNames.length > 0) {
		scheduleCycle();
	}
}

function stopScheduler() {
	schedulerRunning = false;
	for (const timer of toastTimers) clearTimeout(timer);
	toastTimers.length = 0;
	if (cycleTimer) {
		clearTimeout(cycleTimer);
		cycleTimer = null;
	}
}

export function addClient(emit: Emitter) {
	clients.add(emit);
	if (clients.size === 1) {
		startScheduler();
	}
}

export function removeClient(emit: Emitter) {
	clients.delete(emit);
	if (clients.size === 0) {
		stopScheduler();
	}
}
