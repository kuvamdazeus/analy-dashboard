import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Box, Select, useColorMode } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { DURATIONS } from "@/constants";
import { Duration } from "@/types";
import { api } from "@/utils/api";

export default function DashboardChart() {
  const { colorMode } = useColorMode();

  const router = useRouter();

  const [duration, setDuration] = useState<Duration>("7d");

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const chart = api.dashboard.getChartData.useQuery(
    {
      projectId,
      duration,
    },
    { refetchOnWindowFocus: false }
  );

  const getCategories = () => {
    if (!chart.data) return [];

    const categories = new Set<string>();
    chart.data.pageViewsChartData.forEach((item) => categories.add(item.date));
    chart.data.uniqueVisitsChartData.forEach((item) =>
      categories.add(item.date)
    );
    chart.data.sessionChartData.forEach((item) => categories.add(item.date));

    return Array.from(categories).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  };

  const getSeriesData = (
    series: { date: string; _count: { _all: number } }[]
  ) => {
    const categories = getCategories();

    const seriesData = categories.map((category) => {
      const seriesItem = series.find((item) => item.date === category);

      if (seriesItem) {
        return seriesItem._count._all;
      } else {
        return 0;
      }
    });

    return seriesData;
  };

  const options: Highcharts.Options = useMemo(
    () => ({
      chart: {
        backgroundColor: colorMode === "dark" ? "rgb(31 41 55)" : "white",
        plotBorderColor: "white",
      },
      colors: [
        "#FD151B",
        "#FFB30F",
        "#8075FF",
        "#6DD3CE",
        "#BCE784",
        "#348AA7",
      ],
      title: {
        text: "",
      },
      series: [
        {
          data: chart.data ? getSeriesData(chart.data.pageViewsChartData) : [],
          type: "line",
          name: "Page Views",
        },
        {
          data: chart.data
            ? getSeriesData(chart.data.uniqueVisitsChartData)
            : [],
          type: "line",
          name: "Unique Page Views",
        },
        {
          data: chart.data ? getSeriesData(chart.data.sessionChartData) : [],
          type: "line",
          name: "Sessions",
        },
      ],
      xAxis: {
        type: "category",
        title: {
          text: "",
        },
        categories: getCategories(),
      },
      yAxis: {
        title: {
          text: "",
        },
        gridLineColor:
          colorMode === "dark" ? "rgb(54,66,82)" : "rgb(237, 237, 237)",
      },
    }),
    [chart.data, colorMode]
  );

  const fetchChartData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value as Duration);
  };

  // useEffect(() => {
  //   chart.load(`${window.location.pathname}/data?type=chart&duration=7d`);
  // }, [location]);

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      className="rounded-lg bg-white p-1 dark:bg-gray-800"
    >
      <Box className="flex w-full justify-end p-5">
        <Select
          defaultValue="7d"
          size="sm"
          w="max"
          rounded="lg"
          borderColor="gray.500"
          onChange={fetchChartData}
        >
          {DURATIONS.map(
            ({ label, value }) =>
              value !== "1d" && (
                <option key={value} value={value}>
                  {label}
                </option>
              )
          )}
        </Select>
      </Box>

      <Box flexGrow={1} borderTopColor="white" className="h-1/2 bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
