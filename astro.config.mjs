import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://officecli.ndjp.net",
  vite: {
    plugins: [tailwindcss()],
  },
});
