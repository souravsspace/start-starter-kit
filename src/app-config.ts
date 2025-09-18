import packageJson from "../package.json";

export const appConfig = {
  name: packageJson.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  version: packageJson.version,
};
