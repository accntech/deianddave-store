import { PAYMONGO_SECRET_KEY } from '$env/static/private';

class Paymongo {
	private auth: string = 'Basic ' + Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64');

	async tryEnablingWebhook(options: WebhookOptions) {
		try {
			const url = `https://api.paymongo.com/v1/webhooks?limit=${options.limit}`;
			const opts = {
				method: 'GET',
				headers: {
					accept: 'application/json',
					authorization: this.auth
				}
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Unable to list webhooks.');
				return false;
			}

			const listData: WebhookData = await response.json();

			const existingWebhook = listData.data.find(
				(webhook) => webhook.attributes.url === options.url
			);

			if (existingWebhook) {
				const allEventsIncluded = options.events.every((event) =>
					existingWebhook.attributes.events.includes(event)
				);
				if (!allEventsIncluded) {
					return await this.createWebhook(options);
				}

				if (existingWebhook.attributes.status !== 'enabled') {
					return await this.enableWebhook(existingWebhook.id);
				}
				return true;
			} else {
				return await this.createWebhook(options);
			}
		} catch (error) {
			console.error('Error enabling webhook:', error);
			return false;
		}
	}

	private async createWebhook(options: Omit<WebhookOptions, 'limit'>) {
		try {
			const url = 'https://api.paymongo.com/v1/webhooks';
			const opts = {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					authorization: this.auth
				},
				body: JSON.stringify({
					data: {
						attributes: {
							url: url,
							events: options.events
						}
					}
				})
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Unable to list webhooks.');
				return false;
			}
			return true;
		} catch (error) {
			console.log('Error creating webhook:', error);
			return false;
		}
	}

	private async enableWebhook(id: string) {
		try {
			const url = `https://api.paymongo.com/v1/webhooks/${id}/enable`;
			const opts = {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					authorization: this.auth
				}
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Failed to enable webhook');
				return false;
			}
			return true;
		} catch (error) {
			console.log('Failed to enable webhook:', error);
			return false;
		}
	}

	async createPaymentIntent(options: PaymentIntentOptions) {
		try {
			const url = options.url || 'https://api.paymongo.com/v1/payment_intents';
			const amount = options.amount;
			const currency = options.currency || 'PHP';
			const paymentMethodAllowed = options.payment_method_allowed || [
				'card',
				'paymaya',
				'gcash',
				'grab_pay'
			];

			const opts = {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					authorization: this.auth
				},
				body: JSON.stringify({
					data: {
						attributes: {
							amount: amount,
							payment_method_allowed: paymentMethodAllowed,
							payment_method_options: { card: { request_three_d_secure: 'any' } },
							currency: currency,
							capture_type: 'automatic'
						}
					}
				})
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Error creating payment intent:', await response.json());
				return {} as PaymentIntentData;
			}

			const result: PaymentIntentData = await response.json();

			return result;
		} catch (error) {
			console.error('Error creating payment intent:', error);
			return {} as PaymentIntentData;
		}
	}

	async createPaymentMethod(options: PaymentMethodOptions) {
		try {
			const url = options.url || 'https://api.paymongo.com/v1/payment_methods';
			const opts = {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					authorization: this.auth
				},
				body: JSON.stringify({
					data: {
						attributes: {
							details: options.details,
							billing: options.billing,
							type: options.type
						}
					}
				})
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Error creating payment method:', await response.json());
				return {} as PaymentMethodData;
			}

			const result: PaymentMethodData = await response.json();

			return result;
		} catch (error) {
			console.error('Error creating payment method:', error);
			return {} as PaymentMethodData;
		}
	}

	async attachPaymentIntent(options: AttachmentOption) {
		try {
			const url =
				options.url ||
				`https://api.paymongo.com/v1/payment_intents/${options.payment_intent}/attach`;
			const opts = {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json',
					authorization: this.auth
				},
				body: JSON.stringify({
					data: {
						attributes: {
							payment_method: options.payment_method,
							client_key: options.client_key,
							return_url: options.return_url
						}
					}
				})
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Error attaching payment intent:', await response.json());
				return {} as PaymentIntentData;
			}

			const result: PaymentIntentData = await response.json();
			return result;
		} catch (error) {
			console.error('Error attaching payment intent:', error);
			return {} as PaymentIntentData;
		}
	}

	async getPaymentIntent(id: string) {
		try {
			const url = `https://api.paymongo.com/v1/payment_intents/${id}`;
			const opts = {
				method: 'GET',
				headers: {
					accept: 'application/json',
					authorization: this.auth
				}
			};

			const response = await fetch(url, opts);
			if (!response.ok) {
				console.error('Error fetching payment intent:', await response.json());
				return {} as PaymentIntentData;
			}

			const result: PaymentIntentData = await response.json();
			return result;
		} catch (error) {
			console.error('Error fetching payment intent:', error);
			return {} as PaymentIntentData;
		}
	}
}

export type Webhook = {
	id: string;
	type: string;
	attributes: {
		events: string[];
		livemode: boolean;
		secret_key: string;
		status: string;
		url: string;
		created_at: Date;
		updated_at: Date;
	};
};

export type WebhookData = {
	has_more: false;
	total_records: number;
	data: Webhook[];
};

export type WebhookOptions = {
	limit: number;
	url: string;
	events: string[];
};

export type PaymentIntentOptions = {
	amount: number;
	currency?: string;
	payment_method_allowed?: string[];
	url?: string;
};

export type PaymentIntentData = {
	data: {
		id: string;
		type: string;
		attributes: {
			amount: number;
			currency: string;
			description: string;
			statement_descriptor: string;
			status: string;
			livemode: boolean;
			client_key: string;
			last_payment_error: Record<string, string> | null;
			payment_method_allowed: string[];
			payments: [];
			next_action: {
				type: string;
				redirect: {
					url: string;
					return_url: string;
				};
			} | null;
			payment_method_options: {
				card: {
					request_three_d_secure: string;
				};
			};
			metadata: Record<string, string> | null;
			setup_future_usage: {
				session_type: string;
				customer_id: string;
			} | null;
			created_at: Date;
			updated_at: Date;
		};
	};
};

export type PaymentMethodOptions = {
	type: string;
	billing: {
		address: {
			city: string | null;
			country: string | null;
			line1: string | null;
			line2: string | null;
			postal_code: string | null;
			state: string | null;
		};
		email: string;
		name: string;
		phone: string;
	};
	details: {
		card_number: string;
		exp_month: number;
		exp_year: number;
		cvc: string;
		bank_code?: string | null;
	};
	url?: string;
};

export type PaymentMethodData = {
	data: {
		id: string;
		type: string;
		attributes: {
			billing: {
				address: {
					city: string;
					country: string;
					line1: string;
					line2: string;
					postal_code: string;
					state: string;
				};
				email: string;
				name: string;
				phone: string;
			};
			details: {
				last4: string;
				exp_month: number;
				exp_year: number;
			};
			livemode: boolean;
			type: string;
			metadata: Record<string, string> | null;
			created_at: Date;
			updated_at: Date;
		};
	};
};

export type AttachmentOption = {
	payment_intent: string;
	payment_method: string;
	client_key: string;
	url?: string;
	return_url?: string;
};

export const paymongo = new Paymongo();
