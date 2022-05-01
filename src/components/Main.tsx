import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  Select,
  Text,
} from "@chakra-ui/react";
import { getAbi } from "../utils/getters";
import mint from "../utils/mint";

const Main = () => {
  const [network, setNetwork] = useState<string>("");
  const [infuraApiKey, setInfuraApiKey] = useState<string>("");
  const [etherscanApiKey, setEtherscanApiKey] = useState<string>("");
  const [walletPrivateKey, setWalletPrivateKey] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [abi, setAbi] = useState<any>();
  const [publicMethodName, setPublicMethodName] = useState<string>("");
  const [mintMethodName, setMintMethodName] = useState<string>("");
  const [mintMethodArguments, setMintMethodArguments] = useState([]);
  const [price, setPrice] = useState<string>("0");

  const [feedback, setFeedback] = useState<string>();

  useEffect(() => {
    if (network && etherscanApiKey && contractAddress) {
      handleGetAbi();
    }
  }, [contractAddress, etherscanApiKey]);

  const handleGetAbi = async () => {
    const abiJson = await getAbi(network, etherscanApiKey, contractAddress);
    setAbi(abiJson);
  };

  const handleSetFeedback = (feedback: string) => {
    setFeedback(feedback);
  };

  const handleSetMethodArguments = (value: any) => {
    let newArguments: any = [...mintMethodArguments];
    newArguments = [...newArguments, value];

    setMintMethodArguments(newArguments);
  };

  const feedbackStatus =
    feedback && feedback?.includes("trying to mint")
      ? "minting"
      : feedback?.includes("not live")
      ? "notLive"
      : feedback?.includes("Error")
      ? "error"
      : "success";

  return (
    <Flex justifyContent="center" padding="8">
      <Grid width="xl">
        <Text fontSize="xl" textAlign="center" mb="4rem">
          NFT Minting Bot
        </Text>
        <Text fontSize="md" color="red.500">
          {network ? null : " Please select network first"}
        </Text>
        <InputGroup display="flex" alignItems="center" margin="0.5rem 0">
          <Box width="250px">
            <label htmlFor="network">
              <Text fontSize="sm">Network</Text>
            </label>
          </Box>
          <Select
            id="network"
            marginLeft={2}
            size="sm"
            placeholder="Select option"
            onChange={(e) => setNetwork(e.target.value)}
            disabled={
              feedbackStatus === "minting" || feedbackStatus === "notLive"
            }
          >
            <option value="mainnet">Mainnet</option>
            <option value="rinkeby">Rinkeby</option>
          </Select>
        </InputGroup>
        {network ? (
          <>
            <InputGroup display="flex" alignItems="center" margin="0.5rem 0">
              <Box width="250px">
                <label htmlFor="infuraApiKey">
                  <Text fontSize="sm">Infura API key</Text>
                </label>
              </Box>
              <Input
                id="infuraKey"
                marginLeft={2}
                size="sm"
                onChange={(e) => setInfuraApiKey(e.target.value)}
                disabled={
                  feedbackStatus === "minting" || feedbackStatus === "notLive"
                }
                autoComplete="off"
              />
            </InputGroup>
            <InputGroup display="flex" alignItems="center" margin="0.5rem 0">
              <Box width="250px">
                <label htmlFor="etherscanApiKey">
                  <Text fontSize="sm">Etherscan API key</Text>
                </label>
              </Box>
              <Input
                id="etherscanApiKey"
                marginLeft={2}
                size="sm"
                onChange={(e) => setEtherscanApiKey(e.target.value)}
                disabled={
                  feedbackStatus === "minting" || feedbackStatus === "notLive"
                }
                autoComplete="off"
              />
            </InputGroup>
            <InputGroup display="flex" alignItems="center" margin="0.5rem 0">
              <Box width="250px">
                <label htmlFor="walletPrivateKey">
                  <Text fontSize="sm">Wallet private key</Text>
                </label>
              </Box>
              <Input
                id="walletPrivateKey"
                marginLeft={2}
                size="sm"
                onChange={(e) => setWalletPrivateKey(e.target.value)}
                disabled={
                  feedbackStatus === "minting" || feedbackStatus === "notLive"
                }
                autoComplete="off"
              />
            </InputGroup>
            <InputGroup display="flex" alignItems="center" margin="0.5rem 0">
              <Box width="250px">
                <label htmlFor="contractAddress">
                  <Text fontSize="sm">Contract address</Text>
                </label>
              </Box>
              <Input
                id="contractAddress"
                marginLeft={2}
                size="sm"
                onChange={(e) => setContractAddress(e.target.value)}
                disabled={
                  feedbackStatus === "minting" || feedbackStatus === "notLive"
                }
                autoComplete="off"
              />
            </InputGroup>
            {contractAddress && abi ? (
              <>
                <InputGroup
                  display="flex"
                  alignItems="center"
                  margin="0.5rem 0"
                >
                  <Box width="250px">
                    <label htmlFor="publicMethodName">
                      <Text fontSize="sm">Public mint method name</Text>
                    </label>
                  </Box>
                  <Select
                    id="publicMethodName"
                    marginLeft={2}
                    size="sm"
                    placeholder="Select option"
                    onChange={(e) => setPublicMethodName(e.target.value)}
                    disabled={
                      feedbackStatus === "minting" ||
                      feedbackStatus === "notLive"
                    }
                  >
                    {abi.map((item: any, idx: number) => (
                      <option key={idx} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </InputGroup>

                <InputGroup
                  display="flex"
                  alignItems="center"
                  margin="0.5rem 0"
                >
                  <Box width="250px">
                    <label htmlFor="mintMethodName">
                      <Text fontSize="sm">Mint method name</Text>
                    </label>
                  </Box>
                  <Select
                    id="mintMethodName"
                    marginLeft={2}
                    size="sm"
                    placeholder="Select option"
                    onChange={(e) => setMintMethodName(e.target.value)}
                    disabled={
                      feedbackStatus === "minting" ||
                      feedbackStatus === "notLive"
                    }
                  >
                    {abi
                      .filter((x: any) => x.name && x.name.includes("mint"))
                      .map((item: any, idx: number) => (
                        <option key={idx} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </Select>
                </InputGroup>
                {mintMethodName
                  ? abi
                      .find((x: any) => x.name === mintMethodName)
                      ?.inputs?.map((item: any, idx: number) => (
                        <InputGroup
                          key={idx}
                          display="flex"
                          alignItems="center"
                          margin="0.5rem 0"
                        >
                          <Box width="250px">
                            <label htmlFor="publicMethodName">
                              <Text fontSize="sm" pl="6">
                                {item.name}
                              </Text>
                            </label>
                          </Box>
                          <Input
                            id="contractAddress"
                            marginLeft={2}
                            size="sm"
                            onChange={(e) =>
                              handleSetMethodArguments(e.target.value)
                            }
                            disabled={
                              feedbackStatus === "minting" ||
                              feedbackStatus === "notLive"
                            }
                            autoComplete="off"
                          />
                        </InputGroup>
                      ))
                  : null}
                {mintMethodName ? (
                  <InputGroup
                    display="flex"
                    alignItems="center"
                    margin="0.5rem 0"
                  >
                    <Box width="250px">
                      <label htmlFor="price">
                        <Text fontSize="sm">Price</Text>
                      </label>
                    </Box>
                    <Input
                      id="price"
                      marginLeft={2}
                      size="sm"
                      onChange={(e) => setPrice(e.target.value)}
                      disabled={
                        feedbackStatus === "minting" ||
                        feedbackStatus === "notLive"
                      }
                      type="number"
                      autoComplete="off"
                    />
                  </InputGroup>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
        <Grid textAlign="center" mt="4">
          <>
            {feedback && (
              <Text
                color={
                  feedbackStatus === "minting"
                    ? "yellow.500"
                    : feedbackStatus === "notLive" || feedbackStatus === "error"
                    ? "red.500"
                    : "green.500"
                }
              >
                {feedback}
              </Text>
            )}
          </>
        </Grid>
        {network ? (
          <Flex justifyContent="center" mt="6">
            <Button
              w="xs"
              disabled={
                (!infuraApiKey ||
                  !etherscanApiKey ||
                  !walletPrivateKey ||
                  !contractAddress ||
                  !mintMethodName ||
                  feedbackStatus === "minting") &&
                feedbackStatus !== "error"
              }
              onClick={() =>
                mint(
                  network,
                  contractAddress,
                  abi,
                  infuraApiKey,
                  walletPrivateKey,
                  publicMethodName,
                  mintMethodName,
                  mintMethodArguments,
                  price,
                  handleSetFeedback
                )
              }
            >
              {feedbackStatus === "error" ? "Try again" : "Mint"}
            </Button>
          </Flex>
        ) : null}
      </Grid>
    </Flex>
  );
};

export default Main;
