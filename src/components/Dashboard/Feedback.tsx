import formatDistance from "date-fns/formatDistance";
import { WORD_RATING } from "@/constants";
import type { Feedback } from "@prisma/client";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiFrown, FiMeh, FiSmile } from "react-icons/fi";

interface Props {
  feedback: Feedback;
}

export default function Feedback({ feedback }: Props) {
  const [open, setOpen] = useState(false);

  const {
    rating,
    neediness,
    recommended,
    negative_comment,
    positive_comment,
    created_at,
  } = feedback;

  const totalRating = rating + neediness + recommended;

  const emoji =
    totalRating === 5
      ? "😍"
      : totalRating <= 4 && totalRating >= 2
      ? "😄"
      : totalRating <= 1 && totalRating >= 0
      ? "😕"
      : "😡";

  let comment =
    totalRating > 2 ? positive_comment || "" : negative_comment || "";

  return (
    <>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="xl">
        <ModalOverlay />

        <ModalContent>
          <div className="p-5">
            <p className="mb-5 text-2xl font-bold">User Feedback</p>

            {/* -- SAME AS THE PUBLIC FEEDBACK PAGE -- */}
            <p className="mb-3 text-sm italic lg:text-lg">
              Please rate our product
            </p>
            <div className="flex w-full items-center">
              <div
                style={
                  {
                    color: rating === 1 && "#22c55e",
                    borderColor: rating === 1 && "#22c55e",
                  } as any
                }
                className="flex flex-grow justify-center border py-3 text-gray-500"
              >
                <FiSmile className="text-4xl" />
              </div>

              <div
                style={
                  {
                    color: rating === 0 && "#eab308",
                    borderColor: rating === 0 && "#eab308",
                    borderLeft: rating === 0 && "1px solid #eab308",
                  } as any
                }
                className="flex flex-grow justify-center border-t border-b border-r py-3 text-gray-500"
              >
                <FiMeh className="text-4xl" />
              </div>

              <div
                style={
                  {
                    color: rating === -1 && "red",
                    borderColor: rating === -1 && "red",
                    borderLeft: rating === -1 && "1px solid red",
                  } as any
                }
                className="flex flex-grow justify-center border-t border-r border-b py-3 text-gray-500"
              >
                <FiFrown className="text-4xl" />
              </div>
            </div>

            <p className="mt-12 mb-3 text-sm italic lg:text-lg">
              How much do you think you need the product?
            </p>
            <div className="rounded border px-3 py-2 dark:border-gray-600">
              <p className="italic">
                {WORD_RATING.find(({ value }) => value === neediness)?.label}{" "}
                needed
              </p>
            </div>

            <p className="mt-12 mb-3 text-sm italic lg:text-lg">
              How likely are you to recommend the product to a friend?
            </p>
            <div className="rounded border px-3 py-2 dark:border-gray-600">
              <p className="italic">
                {WORD_RATING.find(({ value }) => value === recommended)?.label}{" "}
              </p>
            </div>

            <p className="mt-12 mb-3 text-sm italic lg:text-lg">
              What do you like the most about the product?
            </p>
            <div className="rounded border px-3 py-2 dark:border-gray-600">
              <p className="italic">
                {positive_comment || "-- No comment was provided --"}
              </p>
            </div>

            <p className="mt-12 mb-3 text-sm italic lg:text-lg">
              What do you like the least about the product?
            </p>
            <div className="rounded border px-3 py-2 dark:border-gray-600">
              <p className="italic">
                {negative_comment || "-- No comment was provided --"}
              </p>
            </div>

            <ModalCloseButton />
          </div>
        </ModalContent>
      </Modal>

      <section
        onClick={() => setOpen(true)}
        className="mb-3 flex cursor-pointer items-center justify-between rounded bg-gray-100 py-2 px-3 hover:opacity-80 dark:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          <p className="text-2xl">{emoji}</p>
          <p className="text-sm">
            {WORD_RATING.find(({ value }) => value === neediness)?.label} needed
          </p>
          {comment && (
            <>
              <p className="text-sm">-</p>
              <p className="w-24 truncate text-sm">"{comment}"</p>
            </>
          )}
        </div>

        <p className="flex-shrink-0 text-xs text-gray-500">
          {formatDistance(created_at, new Date(), { addSuffix: true })}
        </p>
      </section>
    </>
  );
}
