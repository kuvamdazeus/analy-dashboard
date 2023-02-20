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
        analy-key={process.env.NEXT_PUBLIC_ANALY_KEY}
      />

      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
