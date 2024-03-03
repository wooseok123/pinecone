import Image from "next/image";
import styles from "./page.module.scss";
import { envConfig } from "@_utils/config";
import { supabase } from "@_libs/database";
import { MusicPlayer } from "@_components/molecules";
import { Flex, Space, Text } from "@_components/atoms";
import Link from "next/link";
import Loading from "./loading";

export default async function Home() {
  const { data } = await supabase.from("hi").select();

  return (
    <main className={styles.main}>
      <div
        style={{
          position: "relative",
          width: "700px",
          height: "500px",
          minWidth: "380px",
        }}
      >
        <Image
          src={`/home_bg.webp`}
          alt="Vercel Logo"
          style={{ objectFit: "contain" }}
          fill
        />
        <Image
          src={`/1.webp`}
          alt="Vercel Logo"
          width={200}
          style={{
            position: "absolute",
            top: "130px",
            right: "110px",
            objectFit: "contain",
          }}
          height={300}
        />
        <Text
          as="h1"
          style={{ position: "absolute", top: "300px", right: "40px" }}
          lineHeight="130%"
          font="ChosunGs"
          writingMode={"vertical-rl"}
          size={25}
        >
          솔방울의
          <br />
          개발 블-로그
        </Text>
        <div style={{ position: "absolute", top: "300px", right: "380px" }}>
          <Flex direction="row" align="start" gap={10}>
            <div
              style={{
                position: "relative",
                width: "35px",
                height: "90px",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <Image
                src={`/idcard.png`}
                style={{ cursor: "pointer" }}
                fill
                alt="id"
              />

              <Link
                href="/posts"
                style={{ position: "absolute", padding: "20px 10px" }}
              >
                <Text
                  align={"start"}
                  writingMode={"vertical-rl"}
                  cursor="pointer"
                  size={20}
                >
                  글감
                </Text>
              </Link>
            </div>
            <div
              style={{
                position: "relative",
                width: "35px",
                height: "90px",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <Image
                src={`/idcard.png`}
                style={{ cursor: "pointer" }}
                fill
                alt="id"
              />

              <Link
                href="/resume"
                style={{
                  position: "absolute",
                  padding: "20px 10px",
                }}
              >
                <Text writingMode={"vertical-rl"} cursor="pointer" size={20}>
                  이력서
                </Text>
              </Link>
            </div>
            <div
              style={{
                position: "relative",
                width: "35px",
                height: "90px",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <Image
                src={`/idcard.png`}
                style={{ cursor: "pointer" }}
                fill
                alt="id"
              />

              <Link
                href="/projects"
                style={{
                  position: "absolute",

                  padding: "20px 10px",
                }}
              >
                <Text writingMode={"vertical-rl"} cursor="pointer" size={20}>
                  작품집
                </Text>
              </Link>
            </div>
          </Flex>
        </div>
      </div>
    </main>
  );
}
