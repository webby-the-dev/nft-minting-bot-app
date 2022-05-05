import { ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import InformationContainer from "./components/InformationContainer";
import Main from "./components/Main";

export const App = () => (
  <ChakraProvider theme={theme}>
    <InformationContainer />
    <Main />
  </ChakraProvider>
);
