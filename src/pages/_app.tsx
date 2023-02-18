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
        analy-base-url="http://localhost:3000"
        analy-key="bdeb62c0be50aa23365688ebcfb67af23dce03a03b84a0b81391097089a8aec4"
      />

      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
