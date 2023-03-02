import { WORD_RATING } from "@/constants";
import type { Feedback } from "@prisma/client";

interface Props {
  feedback: Feedback;
}

export default function Feedback({ feedback }: Props) {
  const { rating, neediness, recommended, negative_comment, positive_comment } =
    feedback;

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
    <section className="mb-3 flex items-center gap-3 rounded bg-gray-100 py-2 px-3 dark:bg-gray-700">
      <p className="text-2xl">{emoji}</p>
      <p className="text-sm">
        {WORD_RATING.find(({ value }) => value === neediness)?.label} needed
      </p>
      {comment && (
        <>
          <p className="text-sm">-</p>
          <p className="text-sm">"{comment}"</p>
        </>
      )}
    </section>
  );
}
