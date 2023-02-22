import { type AppType } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import AppWrapper from "@/components/AppWrapper";
import { api } from "../utils/api";
import "analy";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <div
        id="analy-config"
        // analy-base-url="http://localhost:3000"
        analy-key={process.env.NEXT_PUBLIC_ANALY_KEY}
      />

      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
