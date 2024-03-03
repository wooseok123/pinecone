"use server";

import { revalidatePath } from "next/cache";

export default async function refreshDataByPath(path: string = "/") {
  revalidatePath(path);
}
