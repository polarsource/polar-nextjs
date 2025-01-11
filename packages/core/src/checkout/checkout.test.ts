import { describe, it } from "vitest";
import { createCheckoutHandler } from "./checkout";

describe("checkout", () => {
	it("should create a checkout handler", () => {
		const checkoutHandler = createCheckoutHandler({
			getUrl: () => "https://example.com",
			getQueryParam: () => "123",
			json: () => ({}),
			redirect: () => ({}),
		});

		const Checkout = checkoutHandler({
			accessToken: "123",
			successUrl: "https://example.com",
			server: "sandbox",
			includeCheckoutId: true,
		});
	});
});
