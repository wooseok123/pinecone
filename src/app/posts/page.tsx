import { Flex, Text } from "@_components/atoms";
import { supabase } from "@_libs/database";
import Link from "next/link";

export default async function Posts() {
  let { data: postData, error } = await supabase.from("notes").select();
  return (
    <>
      {postData?.map((post) => (
        <Flex key={post.id} direction="row" justify="start" gap={10}>
          <Link href={`/posts/${post.id}`}>
            <Text cursor="pointer">{post.id}</Text>
          </Link>
          <Text>{post.title}</Text>
        </Flex>
      ))}
    </>
  );
}
