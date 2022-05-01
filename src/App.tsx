import { ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import Main from "./components/Main";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Main />
  </ChakraProvider>
);
