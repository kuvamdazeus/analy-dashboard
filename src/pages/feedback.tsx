import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { Select } from "@chakra-ui/react";
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
  const feedbackMutation = api.feedback.publishFeedback.useMutation();

  const [rating, setRating] = useState<1 | 0 | -1 | null>(null);
  const [neediness, setNeediness] = useState<-2 | -1 | 1 | 2>(2);
  const [recommended, setRecommended] = useState<-2 | -1 | 1 | 2>(2);
  const [negative_comment, setNegativeComment] = useState("");
  const [positive_comment, setPositiveComment] = useState("");

  const publishFeedback = async () => {
    if (!rating || !neediness || !recommended) {
      return;
    }

    feedbackMutation.mutate({
      session_id,
      rating,
      neediness,
      recommended,
      negative_comment,
      positive_comment,
    });
  };

  return (
    <section className="flex justify-center">
      <div className="w-full border border-gray-100 dark:border-gray-800 lg:w-7/12">
        <div className="p-10">
          <center>
            <a href={project_url} className="text-3xl" target="_blank">
              {project_name}
            </a>
          </center>

          <p className="mt-12 mb-3 text-sm italic lg:text-lg">
            Please rate our product
          </p>
          <div className="flex w-full items-center">
            <div
              onClick={() => setRating(1)}
              style={
                {
                  color: rating === 1 && "#22c55e",
                  borderColor: rating === 1 && "#22c55e",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border py-3 text-gray-500 hover:border-green-500 hover:text-green-500 focus:border-green-500 focus:text-green-500"
            >
              <FiSmile className="text-4xl" />
            </div>

            <div
              onClick={() => setRating(0)}
              style={
                {
                  color: rating === 0 && "#eab308",
                  borderColor: rating === 0 && "#eab308",
                  borderLeft: rating === 0 && "1px solid #eab308",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border-t border-b border-r py-3 text-gray-500 hover:border-l hover:border-yellow-500 hover:text-yellow-500 focus:border-yellow-500 focus:text-yellow-500"
            >
              <FiMeh className="text-4xl" />
            </div>

            <div
              onClick={() => setRating(-1)}
              style={
                {
                  color: rating === -1 && "red",
                  borderColor: rating === -1 && "red",
                  borderLeft: rating === -1 && "1px solid red",
                } as any
              }
              className="flex flex-grow cursor-pointer justify-center border-t border-r border-b py-3 text-gray-500 hover:border-l hover:border-red-500 hover:text-red-500 focus:border-red-500 focus:text-red-500"
            >
              <FiFrown className="text-4xl" />
            </div>
          </div>

          <p className="mt-12 mb-3 text-sm italic lg:text-lg">
            How much do you think you need the product?
          </p>
          <Select
            fontSize={14}
            value={neediness}
            onChange={(e) => setNeediness(parseInt(e.target.value) as any)}
          >
            <option value={2}>Definitely need it</option>
            <option value={1}>Kind of need it</option>
            <option value={-1}>Dont really need it</option>
            <option value={-2}>Definitely dont need it</option>
          </Select>

          <p className="mt-12 mb-3 text-sm italic lg:text-lg">
            How likely are you to recommend the product to a friend?
          </p>
          <Select
            fontSize={14}
            value={recommended}
            onChange={(e) => setRecommended(parseInt(e.target.value) as any)}
          >
            <option value={2}>Definitely</option>
            <option value={1}>Probably</option>
            <option value={-1}>Probably not</option>
            <option value={-2}>Definitely not</option>
          </Select>

          <p className="mt-12 mb-3 text-sm italic lg:text-lg">
            What do you like the most about the product?
          </p>
          <textarea
            className="h-24 w-full border bg-transparent p-2 text-sm"
            onChange={(e) => setPositiveComment(e.target.value)}
          />

          <p className="mt-12 mb-3 text-sm italic lg:text-lg">
            What do you like the least about the product?
          </p>
          <textarea
            className="h-24 w-full border bg-transparent p-2 text-sm"
            onChange={(e) => setNegativeComment(e.target.value)}
          />
        </div>

        <center>
          <button
            onClick={publishFeedback}
            disabled={
              !rating ||
              !neediness ||
              !recommended ||
              feedbackMutation.isLoading
            }
            className="mt-12 w-full bg-green-500 p-3 text-lg font-bold text-white transition-all duration-300 hover:opacity-80"
          >
            Submit Feedback
          </button>
        </center>
      </div>
    </section>
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
