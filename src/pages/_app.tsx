import { type AppType } from "next/app";
import { api } from "../utils/api";
import "analy";

import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <div
        id="analy-config"
        // analy-base-url="http://localhost:3000"
        analy-key="e81a076aaae3e382a0ead009dd3d84bbf8ec8cf0846d36d80973c106311e9bf7"
      />

      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
