import { envConfig } from "@_utils/config";

export default function myImageLoader({ src, width, quality }: any) {
  return `${envConfig.assetPath}/${src}?w=${width}&q=${quality || 75}`;
}
