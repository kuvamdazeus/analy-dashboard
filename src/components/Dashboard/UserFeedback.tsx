import { DURATIONS } from "@/constants";
import { Duration } from "@/types";
import { api } from "@/utils/api";
import {
  Box,
  Divider,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Select,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiSliders } from "react-icons/fi";
import Pagination from "../common/Pagination";
import Feedback from "./Feedback";

export default function UserFeedback() {
  const router = useRouter();

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const [pageNumber, setPageNumber] = useState(0);
  const [duration, setDuration] = useState<Duration>("7d");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [filter, setFilter] = useState<"positive" | "negative" | "all">("all");

  const userFeedback = api.dashboard.getFeedbackData.useQuery({
    duration,
    projectId,
    pageNumber,
    filter,
  });

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      className="relative flex w-1/2 flex-col justify-between rounded-lg bg-white p-3 dark:bg-gray-800"
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xl font-bold">User Feedback</p>

        <Select
          value={duration}
          onChange={(e) => setDuration(e.target.value as Duration)}
          borderColor="gray.500"
          w="max-content"
          size="sm"
          rounded="md"
        >
          {DURATIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div className="h-full overflow-y-scroll rounded-lg p-3">
        {userFeedback.data?.feedbackData?.map((feedback) => (
          <Feedback key={feedback.id} feedback={feedback} />
        ))}
      </div>

      <div className="flex w-full items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <Popover
          isOpen={filterPopoverOpen}
          onClose={() => setFilterPopoverOpen(false)}
        >
          <PopoverTrigger>
            <button
              onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
              className="flex items-center rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700"
            >
              <FiSliders className="mr-2" />
              <p className="text-sm font-bold">Filters</p>
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <PopoverArrow />
            <div className="p-3">
              <p className="text-lg font-bold">Filters</p>

              <Divider my="1" />

              <p
                onClick={() => {
                  setFilter("positive");
                  setFilterPopoverOpen(false);
                }}
                className={`mb-1 cursor-pointer p-1 ${
                  filter === "positive" ? "font-bold" : "font-light"
                } hover:bg-gray-700`}
              >
                😍 Postive ratings
              </p>

              <p
                onClick={() => {
                  setFilter("negative");
                  setFilterPopoverOpen(false);
                }}
                className={`cursor-pointer p-1 ${
                  filter === "negative" ? "font-bold" : "font-light"
                } hover:bg-gray-700`}
              >
                😡 Negative ratings
              </p>

              <p
                onClick={() => {
                  setFilter("all");
                  setFilterPopoverOpen(false);
                }}
                className={`cursor-pointer p-1 ${
                  filter === "all" ? "font-bold" : "font-light"
                } hover:bg-gray-700`}
              >
                🥹 All ratings
              </p>
            </div>
          </PopoverContent>
        </Popover>

        {userFeedback.data?.totalPages ? (
          <Pagination
            pageCount={userFeedback.data.totalPages}
            onChange={({ selected }) => setPageNumber(selected)}
          />
        ) : null}
      </div>
    </Box>
  );
}
