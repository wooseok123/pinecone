"use client";

import { useCallback, useState } from "react";
import { Editor, Element, Transforms, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import "highlight.js/styles/github-dark-dimmed.css";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import "./page.style.scss";
import { supabase } from "@_libs/database";
import { envConfig } from "@_utils/config";
import Highlight from "react-highlight";

// Then register the languages you need
hljs.registerLanguage("typescript", typescript);

const initialValue: Element[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const CustomEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

export default function Admin() {
  const renderElement = useCallback((props) => {
    const elements = {
      code: () => <CodeElement {...props} />,
      bold: () => <BoldElement {...props} />,
      default: () => <DefaultElement {...props} />,
    };

    const inputType = props.element.type;
    if (!elements.hasOwnProperty(inputType)) {
      return elements.default();
    }

    return elements[inputType]();
  }, []);

  const handleFileDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
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
      console.log(data, error);
      imgSrc = `${envConfig.database_url}/storage/v1/object/public/${data.fullPath}`;
    }

    CustomEditor["img"](editor, imgSrc);
  };

  const onKeyDown = (event) => {
    const keyEvent = {
      "`": () => {
        const isCodeBlockActive = (editor) => {
          const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "code",
          });

          return !!match;
        };
        const isActive = isCodeBlockActive(editor);
        Transforms.setNodes(editor, { type: isActive ? "default" : "code" });
      },
      b: () => {
        const isBoldActive = (editor) => {
          const [match] = Editor.nodes(editor, {
            match: (n) => n.type === "bold",
          });

          return !!match;
        };
        const isActive = isBoldActive(editor);
        Transforms.setNodes(
          editor,
          { type: isActive ? "default" : "bold" },
          { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
        );
      },
    };

    if (!event.ctrlKey || !keyEvent.hasOwnProperty(event.key)) return;

    event.preventDefault();
    keyEvent[event.key]();
  };

  const [editor] = useState(() => withReact(createEditor()));
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        onKeyDown={(event) => {
          onKeyDown(event);
        }}
      />
    </Slate>
  );
}

const CodeElement = (props) => {
  const dummy = { ...props.children[0] };
  const highlighted_code = hljs.highlight(dummy.props.text.text, {
    language: "typescript",
  }).value;
  return (
    <pre>
      {/* <Highlight innerHtml={true}>{dummy.props.text.text}</Highlight> */}
      <code dangerouslySetInnerHTML={{ __html: highlighted_code }}></code>
      <code {...props.attributes} style={{ display: "none" }}>
        {dummy}
      </code>
    </pre>
  );
};

const BoldElement = (props) => {
  return (
    <p {...props.attributes} style={{ fontWeight: "bold" }}>
      {props.children}
    </p>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
