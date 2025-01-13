import { Polar } from "@polar-sh/sdk";
import { type NextRequest, NextResponse } from "next/server";

export interface CustomerPortalConfig {
	accessToken: string;
	getCustomerId: (req: NextRequest) => Promise<string>;
	server: "sandbox" | "production";
}

export const CustomerPortal = ({
	accessToken,
	server,
	getCustomerId,
}: CustomerPortalConfig) => {
	const polar = new Polar({
		accessToken,
		server,
	});

	return async (req: NextRequest) => {
		const customerId = await getCustomerId(req);

		if (!customerId) {
			return NextResponse.json(
				{ error: "customerId not defined" },
				{ status: 400 },
			);
		}

		try {
			const result = await polar.customerSessions.create({
				customerId,
			});

			return NextResponse.redirect(result.customerPortalUrl);
		} catch (error) {
			console.error(error);
			return NextResponse.error();
		}
	};
};
