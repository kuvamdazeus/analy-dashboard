import { prisma } from "@/server/db";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
} from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { FiFrown, FiMeh, FiSmile } from "react-icons/fi";

interface Props {
  session_id: string;
  project_name: string;
  project_url: string;
}

export default function FeedbackPage({
  session_id,
  project_name,
  project_url,
}: Props) {
  const [satisfaction, setSatisfaction] = useState<
    "smile" | "meh" | "frown" | ""
  >("");

  const [hovered, setHovered] = useState<"smile" | "meh" | "frown" | "">("");

  return (
    <div className="dark">
      <section className="flex h-screen justify-center">
        <div className="h-screen w-2/5 border p-5 dark:border-gray-800">
          <center>
            <a href={project_url} className="text-3xl" target="_blank">
              {project_name}
            </a>
          </center>

          <p className="mt-12 mb-3 text-lg italic">Please rate our product</p>
          <div className="flex w-full items-center">
            <div
              onClick={() => setSatisfaction("smile")}
              style={
                {
                  color: satisfaction === "smile" && "#22c55e",
                  borderColor: satisfaction === "smile" && "#22c55e",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border py-3 text-gray-500 hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500"
            >
              <FiSmile className="text-4xl" />
            </div>

            <div
              onClick={() => setSatisfaction("meh")}
              style={
                {
                  color: satisfaction === "meh" && "#eab308",
                  borderColor: satisfaction === "meh" && "#eab308",
                  borderLeft: satisfaction === "meh" && "1px solid #eab308",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border-t border-b border-r py-3 text-gray-500 hover:border-l hover:border-yellow-500 hover:text-yellow-500 focus:border-yellow-500 focus:text-yellow-500"
            >
              <FiMeh className="text-4xl" />
            </div>

            <div
              onClick={() => setSatisfaction("frown")}
              style={
                {
                  color: satisfaction === "frown" && "red",
                  borderColor: satisfaction === "frown" && "red",
                  borderLeft: satisfaction === "frown" && "1px solid red",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border-t border-r border-b py-3 text-gray-500 hover:border-l hover:border-red-500 hover:text-red-500 focus:border-red-500 focus:text-red-500"
            >
              <FiFrown className="text-4xl" />
            </div>
          </div>

          <p className="mt-12 mb-3 text-lg italic">
            How much do you think you need the product?
          </p>
          <Select className="">
            <option>Definitely need it</option>
            <option>Kind of need it</option>
            <option>Dont really need it</option>
            <option>Definitely dont need it</option>
          </Select>

          <p className="mt-12 mb-3 text-lg italic">
            How likely are you to recommend the product to a friend?
          </p>
          <Select className="">
            <option>Definitely</option>
            <option>Probably</option>
            <option>Probably not</option>
            <option>Definitely not</option>
          </Select>

          <p className="mt-12 mb-3 text-lg italic">
            What do you like the most about the product?
          </p>
          <textarea className="h-24 w-full border bg-transparent p-2" />

          <p className="mt-12 mb-3 text-lg italic">
            What do you like the least about the product?
          </p>
          <textarea className="h-24 w-full border bg-transparent p-2" />

          <center>
            <button className="mt-12 w-full bg-green-500 p-3 text-lg font-bold text-white transition-all duration-300 hover:opacity-80">
              Submit Feedback
            </button>
          </center>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sessionId = query.sid as string;

  if (!sessionId) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
      props: {},
    };
  }

  const session = await prisma.session.findUniqueOrThrow({
    where: {
      id: sessionId,
    },
    include: {
      project: true,
    },
  });

  return {
    props: {
      session_id: session.id,
      project_name: session.project.name,
      project_url: session.project.url,
    },
  };
};
