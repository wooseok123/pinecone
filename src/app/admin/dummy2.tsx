// "use client";

// import { supabase } from "@_libs/database";
// import { revalidatePath } from "next/cache";
// // Import the `Editor` and `Transforms` helpers from Slate.
// import { useCallback, useEffect, useMemo, useState } from "react";
// import parse from "html-react-parser";
// import {
//   Editor,
//   Transforms,
//   Element,
//   createEditor,
//   Descendant,
//   Node,
// } from "slate";
// import { Editable, Slate, withReact } from "slate-react";
// import refreshDataByPath from "../action";
// import { envConfig } from "@_utils/config";
// // Using ES6 import syntax
// import hljs from "highlight.js/lib/core";
// import javascript from "highlight.js/lib/languages/javascript";

// hljs.registerLanguage("javascript", javascript);

// const initialValue: Descendant[] = [
//   {
//     type: "paragraph",
//     children: [{ text: "A line of text in a paragraph." }],
//   },
// ];

// let headingCount = 0;

// const CustomEditor = {
//   isBoldMarkActive(editor) {
//     const marks = Editor.marks(editor);
//     return marks ? marks.bold === true : false;
//   },

//   isCodeBlockActive(editor) {
//     const [match] = Editor.nodes(editor, {
//       match: (n) => n.type === "code",
//     });
//     return !!match;
//   },

//   b(editor) {
//     const isActive = CustomEditor.isBoldMarkActive(editor);
//     if (isActive) {
//       Editor.removeMark(editor, "bold");
//     } else {
//       Editor.addMark(editor, "bold", true);
//     }
//   },

//   "`"(editor) {
//     const isActive = CustomEditor.isCodeBlockActive(editor);
//     Transforms.setNodes(editor, { type: isActive ? null : "code" });
//   },

//   isH1Active(editor) {
//     const [match] = Editor.nodes(editor, {
//       match: (n) => n.type === "h1",
//     });
//     return !!match;
//   },

//   // 얘도 toggle 해야 함. 예를 들면 h6 다음이 p 태그라던지.. default
//   "3"(editor) {
//     headingCount >= 3 ? (headingCount = 0) : (headingCount += 1);
//     Transforms.setNodes(
//       editor,
//       { type: headingCount === 0 ? "p" : `h${headingCount}` },
//       { match: (n) => Element.isElement(n) }
//     );
//   },

//   img(editor, src) {
//     const text = { text: "" };
//     const image = { type: "img", src, children: [text] };
//     Transforms.insertNodes(editor, image);
//     Transforms.insertNodes(editor, {
//       type: "paragraph",
//       children: [{ text: "" }],
//     });
//   },
// };

// const RenderElements = {
//   code: (props) => <CodeElement {...props} />,
//   h1: (props) => <H1Element {...props} />,
//   h2: (props) => <H2Element {...props} />,
//   h3: (props) => <H3Element {...props} />,
//   h4: (props) => <H4Element {...props} />,
//   h5: (props) => <H5Element {...props} />,
//   h6: (props) => <H6Element {...props} />,
//   img: (props) => <ImgElement {...props} />,
//   default: (props) => <DefaultElement {...props} />,
// };

// export default function Admin() {
//   const [editor] = useState(() => withReact(createEditor()));
//   const [isCode, setIsCode] = useState(false);
//   const [postData, setPostData] = useState<string>("");

//   // const updateData = async () => {
//   //   const { error } = await supabase.from("notes").insert({ title: "Denmark" });
//   //   refreshDataByPath("/posts");
//   // };

//   const renderElement = useCallback((props) => {
//     const type = props.element.type;
//     const targetType = RenderElements.hasOwnProperty(type) ? type : "default";

//     return RenderElements[targetType](props);
//   }, []);

//   const renderLeaf = useCallback((props) => {
//     return <Leaf {...props} />;
//   }, []);

//   const handleFileDrop = async (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     let imgSrc;
//     const { data: imgList, error: imgListError } = await supabase.storage
//       .from("pinecone")
//       .list();

//     if (imgList?.filter((img) => img.name === file.name).length !== 0) {
//       const { data } = supabase.storage
//         .from("pinecone")
//         .getPublicUrl(`${file.name}`);
//       imgSrc = data.publicUrl;
//     } else {
//       const { data, error } = await supabase.storage
//         .from("pinecone")
//         .upload(`${file.name}`, file);
//       console.log(data, error);
//       imgSrc = `${envConfig.database_url}/storage/v1/object/public/${data.fullPath}`;
//     }

//     CustomEditor["img"](editor, imgSrc);
//   };

//   return (
//     <div style={{ maxWidth: "768px", margin: "0 auto" }}>
//       <Slate
//         editor={editor}
//         initialValue={initialValue}
//         onChange={(value) => {
//           const content = JSON.stringify(value);
//           setPostData(content);
//         }}
//       >
//         <div>
//           <button
//             onMouseDown={(event) => {
//               event.preventDefault();
//               CustomEditor.toggleBoldMark(editor);
//             }}
//           >
//             Bold
//           </button>
//           <button
//             onMouseDown={(event) => {
//               event.preventDefault();
//               CustomEditor.toggleCodeBlock(editor);
//             }}
//           >
//             Code Block
//           </button>
//         </div>
//         <Editable
//           style={{ outline: "none", boxShadow: "0px 0px 10px 0px gray" }}
//           onDrop={handleFileDrop}
//           renderElement={renderElement}
//           renderLeaf={renderLeaf}
//           onKeyDown={(event) => {
//             if (!CustomEditor[event.key] || !event.ctrlKey) return;
//             event.preventDefault();
//             CustomEditor[event.key](editor);
//           }}
//         />
//       </Slate>
//       {/* <App /> */}
//     </div>
//   );
// }

// // const nodes = [
// //   {
// //     type: "paragraph",
// //     children: [{ text: "A line of text in a paragraph." }],
// //   },
// //   {
// //     type: "paragraph",
// //     children: [{ text: "A line of text in a paragraph." }],
// //   },
// //   {
// //     type: "paragraph",
// //     children: [{ text: "A line of text in a paragraph." }],
// //   },
// // ];

// // const SlateEditor = ({ datas }) => {
// //   console.log(datas);
// //   const editor = useMemo(() => withReact(createEditor()), []);

// //   return (
// //     <Slate editor={editor} initialValue={datas}>
// //       <Editable readOnly />
// //     </Slate>
// //   );
// // };

// // const App = () => {
// //   return <SlateEditor datas={nodes} />;
// // };

// const CodeElement = (props) => {
//   // props.children[0].props.text.text
//   console.log(props.children);
//   return (
//     <pre>
//       <code>{props.children}</code>
//     </pre>
//   );
// };

// const H1Element = (props) => {
//   return <h1 {...props.attributes}>{props.children}</h1>;
// };

// const H2Element = (props) => {
//   return <h2 {...props.attributes}>{props.children}</h2>;
// };

// const H3Element = (props) => {
//   return <h3 {...props.attributes}>{props.children}</h3>;
// };
// const H4Element = (props) => {
//   return <h4 {...props.attributes}>{props.children}</h4>;
// };
// const H5Element = (props) => {
//   return <h5 {...props.attributes}>{props.children}</h5>;
// };
// const H6Element = (props) => {
//   return <h6 {...props.attributes}>{props.children}</h6>;
// };

// const ImgElement = (props) => {
//   const src = props.element.src;
//   return <img src={src} alt="blog_img" style={{ margin: "0 auto" }} />;
// };

// const DefaultElement = (props) => {
//   return <p {...props.attributes}>{props.children}</p>;
// };

// const Leaf = (props) => {
//   return (
//     <span
//       {...props.attributes}
//       style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
//     >
//       {props.children}
//     </span>
//   );
// };
