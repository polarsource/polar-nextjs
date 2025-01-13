import { defineNuxtModule, addServerHandler, createResolver } from "@nuxt/kit";
import { fileURLToPath } from "url";

export interface ModuleOptions {
  // Module options if needed
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@polar-sh/nuxt",
    configKey: "polar",
  },
  defaults: {},
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Add runtime directory to Nuxt for proper TypeScript resolution
    nuxt.options.build.transpile.push(runtimeDir);
  },
});
