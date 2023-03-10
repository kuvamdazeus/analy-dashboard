import { DURATIONS } from "@/constants";
import { Duration } from "@/types";
import { api } from "@/utils/api";
import { getJsonStorageData } from "@/utils/misc";
import { Select, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Summary() {
  const router = useRouter();

  const [duration, setDuration] = useState<Duration>("1d");

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const summary = api.dashboard.getSummaryData.useQuery(
    {
      projectId,
      duration,
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        localStorage.setItem(
          `${projectId}_summary_cache`,
          JSON.stringify(data)
        );
      },
      onError: (err) => {
        if (err.data?.httpStatus === 401) {
          router.replace("/");
        }
      },
    }
  );

  const fetchSummaryData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value as Duration);
  };

  const storageSummaryData = getJsonStorageData(
    `${projectId}_summary_cache`
  ) as typeof summary.data;
  const isLoading = summary.isLoading && !storageSummaryData;
  const summaryData = summary.data || storageSummaryData;

  const isEmpty = summaryData
    ? Object.values(summaryData).every((value) => !value)
    : false;

  return (
    <div className="h-full w-1/2 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-5 flex w-full items-center justify-between">
        <p className="mr-5 text-xl font-bold">Summary</p>

        <Select
          defaultValue="1d"
          onChange={fetchSummaryData}
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

      {isEmpty && (
        <p className="mt-16 text-center text-lg font-light text-gray-500">
          No data available
        </p>
      )}

      {isLoading && (
        <div>
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
        </div>
      )}

      {!isEmpty && summaryData && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              UNIQUE VISITS
            </p>

            <div className="flex items-center justify-between rounded-sm bg-transparent p-1 text-xs font-bold text-gray-800 dark:text-white">
              <p className="text-right">
                {summaryData && summaryData.uniquePageVisits}
              </p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              PAGE VIEWS
            </p>

            <div className="flex items-center justify-between rounded-sm bg-transparent p-1 text-xs font-bold text-gray-800 dark:text-white">
              <p className="text-right">
                {summaryData && summaryData.pageViews}
              </p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              SESSION COUNT
            </p>

            <div className="flex items-center justify-between rounded-sm bg-transparent p-1 text-xs font-bold text-gray-800 dark:text-white">
              <p className="text-right">
                {summaryData && summaryData.sessionsCount}
              </p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              AVG. SESSION TIME
            </p>

            <div className="flex items-center justify-between rounded-sm bg-transparent p-1 text-xs font-bold text-gray-800 dark:text-white">
              <p className="text-right">
                {summaryData && Math.round(summaryData.avgSessionsDuration)}s
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
