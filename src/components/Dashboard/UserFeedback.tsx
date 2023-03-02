import { DURATIONS } from "@/constants";
import { api } from "@/utils/api";
import { Box, Select, useColorMode } from "@chakra-ui/react";
import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FiSliders } from "react-icons/fi";
import Feedback from "./Feedback";

export default function UserFeedback() {
  const { colorMode } = useColorMode();

  const router = useRouter();

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const userFeedback = api.dashboard.getFeedbackData.useQuery({
    duration: "7d",
    projectId,
    offset: 0,
  });

  const fetchFeedbackData = (e: React.ChangeEvent<HTMLSelectElement>) => {};

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
          onChange={fetchFeedbackData}
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
          <Feedback feedback={feedback} />
        ))}
      </div>

      <div className="flex w-full items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <button className="flex items-center rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700">
          <FiSliders className="mr-2" />
          <p className="text-sm font-bold">Filters</p>
        </button>

        <Pagination total={10} initialPage={1} />
      </div>
    </Box>
  );
}
