"use client";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef } from "react";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import Prism from "prismjs";
import { supabase } from "@_libs/database";
import { envConfig } from "@_utils/config";
import { File } from "buffer";
import { Button } from "@_components/molecules";
import { Text } from "@_components/atoms";

export default function Admin() {
  const editorRef = useRef<Editor>(null);

  const onUploadImage = async (blob: File) => {
    const file = blob;
    let imgSrc;
    const { data: imgList, error: imgListError } = await supabase.storage
      .from("pinecone")
      .list();

    if (imgList?.filter((img) => img.name === file.name).length !== 0) {
      const { data } = supabase.storage
        .from("pinecone")
        .getPublicUrl(`${file.name}`);
      imgSrc = data.publicUrl;
    } else {
      const { data, error } = await supabase.storage
        .from("pinecone")
        .upload(`${file.name}`, file);
      imgSrc = `${envConfig.database_url}/storage/v1/object/public/${data.fullPath}`;
    }

    return imgSrc;
  };

  useEffect(() => {
    if (!editorRef) return;
    editorRef.current?.getInstance().removeHook("addImageBlobHook");
    editorRef.current
      ?.getInstance()
      .addHook("addImageBlobHook", async (blob: File, callback: any) => {
        const url = await onUploadImage(blob);
        callback(url, blob.name);
        return false;
      });
  }, [editorRef]);

  return (
    <>
      <Editor
        ref={editorRef}
        initialValue="hello react editor world!"
        previewStyle="vertical"
        height="600px"
        useCommandShortcut={true}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      />
      <Button cursor="pointer" padding="10px 30px" radius={8}>
        <Text
          cursor="pointer"
          onClick={() => {
            const data = editorRef.current!.getInstance().getHTML();
            console.log(data);
          }}
          color="white"
        >
          제출하기
        </Text>
      </Button>
    </>
  );
}
