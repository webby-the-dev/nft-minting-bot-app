import { Container, Grid, Flex, Link, Text, Box } from "@chakra-ui/react";
import React from "react";

export default function InfoContainer() {
  return (
    <>
      <Flex p="4" justifyContent="space-between" alignItems="center">
        <Grid>
          <Text>
            Author:{" "}
            <Link
              href="https://github.com/WebbyNFT"
              isExternal
              ml="1"
              color="blue.500"
            >
              Webby NFT
            </Link>
          </Text>
          <Text>Discord: Webby#6345</Text>
        </Grid>
        <Text>Used: 315 times</Text>
      </Flex>
    </>
  );
}
