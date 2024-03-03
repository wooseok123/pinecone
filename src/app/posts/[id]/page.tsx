import { supabase } from "@_libs/database";
import { notFound } from "next/navigation";

export const revalidate = false;

export async function generateStaticParams() {
  let { data: postIDs, error } = await supabase.from("notes").select("id");

  return postIDs!.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function EachPost({ params }: { params: { id: string } }) {
  let {
    data: [postData],
    error,
  } = await supabase.from("notes").select().eq("id", params.id);

  if (!postData) {
    notFound();
  }

  return <>{postData.id}</>;
}
