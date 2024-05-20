import React, { ForwardedRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import Prism from "prismjs";
import { supabase } from "@_libs/database";
import { envConfig } from "@_utils/config";

interface ToastEditorProps {
  editorRef: ForwardedRef<Editor>;
}

const ToastEditor = (props: ToastEditorProps) => {
  const { editorRef } = props;

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
    editorRef.current!.getInstance().removeHook("addImageBlobHook");
    editorRef
      .current!.getInstance()
      .addHook("addImageBlobHook", async (blob: File, callback: any) => {
        const url = await onUploadImage(blob);
        callback(url, blob.name);
        return false;
      });
  }, [editorRef]);

  return (
    <Editor
      ref={editorRef}
      initialValue={"s"}
      previewStyle="vertical"
      height="600px"
      useCommandShortcut={true}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
    />
  );
};

export default ToastEditor;
