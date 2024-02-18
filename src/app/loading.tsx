import { envConfig } from "@_utils/config";
import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src={`${envConfig.assetPath}/cat.webp`}
        width={100}
        height={50}
        alt="loading_cat"
        priority
      />
    </div>
  );
}
