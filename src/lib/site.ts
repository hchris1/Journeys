import fs from "fs";
import path from "path";

interface SiteConfig {
  title: string;
  description: string;
}

const defaults: SiteConfig = {
  title: "Journeys",
  description: "A collection of visual stories from around the world",
};

export function getSiteConfig(): SiteConfig {
  try {
    const configPath = path.join(process.cwd(), "content/site.json");
    const content = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    return { ...defaults, ...config };
  } catch {
    return defaults;
  }
}
