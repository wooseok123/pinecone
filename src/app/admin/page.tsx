"use client";

import { supabase } from "@_libs/database";
import { revalidatePath } from "next/cache";
// Import the `Editor` and `Transforms` helpers from Slate.
import { useCallback, useEffect, useMemo, useState } from "react";
import { Editor, Transforms, Element, createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import refreshDataByPath from "../action";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

let headingCount = 0;

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

  b(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },

  "`"(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  isH1Active(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "h1",
    });
    return !!match;
  },

  "3"(editor) {
    headingCount > 5 ? (headingCount = 1) : (headingCount += 1);
    Transforms.setNodes(
      editor,
      { type: `h${headingCount}` },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },
};

const RenderElements = {
  code: (props) => <CodeElement {...props} />,
  h1: (props) => <H1Element {...props} />,
  h2: (props) => <H2Element {...props} />,
  h3: (props) => <H3Element {...props} />,
  h4: (props) => <H4Element {...props} />,
  h5: (props) => <H5Element {...props} />,
  h6: (props) => <H6Element {...props} />,
  default: (props) => <DefaultElement {...props} />,
};

export default function Admin() {
  const [editor] = useState(() => withReact(createEditor()));

  const [postData, setPostData] = useState<string>("");

  useEffect(() => {
    if (postData) {
      console.log(JSON.parse(postData));
    }
  }, [postData]);

  const updateData = async () => {
    const { error } = await supabase.from("notes").insert({ title: "Denmark" });
    refreshDataByPath("/posts");
    console.log(error);
  };

  const renderElement = useCallback((props) => {
    const type = props.element.type;
    const targetType = RenderElements.hasOwnProperty(type) ? type : "default";
    return RenderElements[targetType](props);
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={updateData}>
        시1발
      </div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const content = JSON.stringify(value);
          setPostData(content);
        }}
      >
        <div>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
          >
            Bold
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            Code Block
          </button>
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!CustomEditor[event.key] || !event.ctrlKey) return;
            event.preventDefault();
            CustomEditor[event.key](editor);
          }}
        />
      </Slate>
      {/* <App /> */}
    </>
  );
}

// const nodes = [
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
// ];

// const SlateEditor = ({ datas }) => {
//   console.log(datas);
//   const editor = useMemo(() => withReact(createEditor()), []);

//   return (
//     <Slate editor={editor} initialValue={datas}>
//       <Editable readOnly />
//     </Slate>
//   );
// };

// const App = () => {
//   return <SlateEditor datas={nodes} />;
// };

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const H1Element = (props) => {
  return <h1 {...props.attributes}>{props.children}</h1>;
};

const H2Element = (props) => {
  return <h2 {...props.attributes}>{props.children}</h2>;
};

const H3Element = (props) => {
  return <h3 {...props.attributes}>{props.children}</h3>;
};
const H4Element = (props) => {
  return <h4 {...props.attributes}>{props.children}</h4>;
};
const H5Element = (props) => {
  return <h5 {...props.attributes}>{props.children}</h5>;
};
const H6Element = (props) => {
  return <h6 {...props.attributes}>{props.children}</h6>;
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
