"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@_components/molecules";
import { Flex, Text } from "@_components/atoms";
import { Editor } from "@toast-ui/react-editor";
import dynamic from "next/dynamic";
import { supabase } from "@_libs/database";

interface PostMetaDataProps {
  title: string;
  keywords: string[];
  subject: string;
}

const DynamicEditor = dynamic(() => import("@_components/atoms/Editor"), {
  ssr: false,
  loading: () => <div></div>,
});

const ForwardRefEditor = forwardRef((props, ref) => (
  <DynamicEditor {...props} editorRef={ref} />
));

ForwardRefEditor.displayName = "ForwardRefEditor";

export default function Admin() {
  const editorRef = useRef<Editor>(null);
  const [postMetaData, setPostMetaData] = useState<PostMetaDataProps>({
    title: "",
    keywords: ["하이"],
    subject: "",
  });
  const [eachKeyword, setEachKeyword] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [subjectData, setSubjectData] = useState("");
  const insertPostData = async () => {
    const postData = {
      ...postMetaData,
      body_text: editorRef.current!.getInstance().getHTML(),
      subject: subjectData,
    };

    const keys = Object.keys(postMetaData) as Array<keyof PostMetaDataProps>;
    for (let key in postMetaData) {
      if (postMetaData[key].length === 0) {
        alert("제목이나 키워드를 써주세요");
        return;
      }
    }
  };

  useEffect(() => {
    const getSubjectList = async () => {
      const { data } = await supabase.from("posts").select("subject");

      const lists = [...new Set(data?.map((el) => el.subject))];
      if (lists[0] === null) return;
      setSubjectList(lists);
    };

    getSubjectList();
  }, []);

  return (
    <>
      <label htmlFor="title">제목</label>
      <input
        id="title"
        defaultValue={postMetaData.title}
        placeholder="제목을 입력해주세요"
        onChange={(e) => {
          setPostMetaData({ ...postMetaData, title: e.target.value });
        }}
      ></input>
      <Flex justify="start" direction="row">
        <Text>키워드</Text>
        <div style={{ backgroundColor: "gray", width: "fit-content" }}>
          <Flex direction="row" justify="start">
            {postMetaData.keywords.map((el, idx) => (
              <Button key={idx} radius={8} cursor="pointer" bgColor="lightGray">
                <Text>{el}</Text>
                <Text
                  cursor="pointer"
                  onClick={() => {
                    setPostMetaData({
                      ...postMetaData,
                      keywords: postMetaData.keywords.filter(
                        (keyword) => keyword !== el
                      ),
                    });
                  }}
                >
                  &nbsp;X
                </Text>
              </Button>
            ))}

            <Button>
              <Text
                color="white"
                cursor="pointer"
                onClick={() => {
                  if (eachKeyword.length === 0) return;
                  setPostMetaData({
                    ...postMetaData,
                    keywords: [...postMetaData.keywords, eachKeyword],
                  });
                  setEachKeyword("");
                }}
              >
                추가하기
              </Text>
            </Button>
            <input
              type="text"
              value={eachKeyword}
              onChange={(e) => {
                setEachKeyword(e.target.value);
              }}
            />
          </Flex>
        </div>
      </Flex>
      <Flex justify="start" direction="row">
        <Text>주제</Text>
        <input
          type="text"
          value={subjectData}
          onChange={(e) => {
            setSubjectData(e.target.value);
          }}
        ></input>
        <select>
          {subjectList?.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </Flex>
      <ForwardRefEditor ref={editorRef} />
      <Button cursor="pointer" padding="10px 30px" radius={8}>
        <Text cursor="pointer" color="white" onClick={() => insertPostData()}>
          제출하기
        </Text>
      </Button>
    </>
  );
}
