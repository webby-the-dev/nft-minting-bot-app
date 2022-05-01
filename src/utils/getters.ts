import axios from "axios";

export const getAbi = async (
  network: string,
  etherscanApiKey: string,
  contractAddress: string
) => {
  const etherscanAbiLink = `https://api${
    network === "rinkeby" ? "-rinkeby" : ""
  }.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`;

  const data = await axios.get(etherscanAbiLink);

  let ABI = JSON.parse(data.data.result);

  return ABI;
};
