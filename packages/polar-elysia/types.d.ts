declare module "@polar-sh/hono" {
	interface Context {
		env: {
			POLAR_ACCESS_TOKEN: string;
		};
	}
}
