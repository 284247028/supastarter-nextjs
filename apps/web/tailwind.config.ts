import baseConfig from "tailwind-config/tailwind.config";
import { Config } from "tailwindcss";

export default {
  presets: [baseConfig],
  content: ["./app/**/*.tsx", "./modules/**/*.tsx"],
} satisfies Config;
