import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import solid from "@astrojs/solid-js";
import auto from "astro-auto-adapter";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: await auto(),
  integrations: [solid(), tailwind()],
  vite: {
    worker: {
      format: "es"
    }
  }
});