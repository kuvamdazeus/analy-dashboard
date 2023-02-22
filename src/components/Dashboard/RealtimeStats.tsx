import { useEffect, useMemo } from "react";
import { Badge, Box, useColorMode } from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { parseRealtimeData } from "@/utils/data";

export default function RealtimeStats() {
  const { colorMode } = useColorMode();

  const router = useRouter();

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const stats = api.dashboard.getRealtimeData.useQuery({ projectId });

  const options: Highcharts.Options = useMemo(() => {
    const statsData = parseRealtimeData(stats.data || []);

    return {
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
          name: "Unique Page Visits",
          data: stats.data
            ? statsData.map(([, data]) => data.uniquePageVisits)
            : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
        {
          name: "Events",
          data: stats.data ? statsData.map(([, data]) => data.events) : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
        {
          name: "Page Views",
          data: stats.data ? statsData.map(([, data]) => data.pageViews) : [],
          type: "line",
          marker: {
            enabled: false,
          },
        },
      ],
      xAxis: {
        type: "category",
        categories: stats.data ? statsData.map(([label]) => label) : [],
        lineColor:
          colorMode === "dark" ? "rgb(108, 119, 133)" : "rgb(237, 237, 237)",
      },
      yAxis: {
        title: {
          text: "",
        },
        gridLineColor:
          colorMode === "dark" ? "rgb(54,66,82)" : "rgb(237, 237, 237)",
      },
    };
  }, [stats.data]);

  useEffect(() => {
    let interval: any = null;

    // set a minute interval to load stats only when the window is in focus
    interval = setInterval(() => {
      if (document.hasFocus()) {
        stats.refetch();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.700",
      }}
      className="w-1/2 rounded-lg bg-white p-3 dark:bg-gray-800"
    >
      <div className="mb-5 flex items-center">
        <p className="mr-2 text-xl font-bold">Realtime Stats</p>

        <div>
          <Badge colorScheme="red">Live</Badge>
        </div>
      </div>

      <Box flexGrow={1} borderTopColor="white" className="bg-white">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
}
