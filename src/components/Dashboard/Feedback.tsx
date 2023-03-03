import formatDistance from "date-fns/formatDistance";
import { WORD_RATING } from "@/constants";
import type { Feedback } from "@prisma/client";

interface Props {
  feedback: Feedback;
}

export default function Feedback({ feedback }: Props) {
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
    <section className="mb-3 flex cursor-pointer items-center justify-between rounded bg-gray-100 py-2 px-3 hover:opacity-80 dark:bg-gray-700">
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
  );
}
