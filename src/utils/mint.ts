import { ethers } from "ethers";

export default (
  network: string,
  contractAddress: string,
  abi: any,
  infuraApiKey: string,
  walletPrivateKey: string,
  publicMethodName: string,
  mintMethodName: string,
  mintMethodArguments: string[],
  price: string,
  setFeedback: (feedback: string) => void
) => {
  const GAS_LIMIT = 2000000;
  const GAS_PRICE = ethers.utils.parseUnits("666", "gwei");

  const amount = 1;
  const TOKEN_PRICE: any = ethers.utils.parseEther(price);
  const INTERVAL = 500;

  const provider = new ethers.providers.JsonRpcProvider(
    `https://${
      network === "rinkeby" ? "rinkeby" : "mainnet"
    }.infura.io/v3/${infuraApiKey}`
  );
  const wallet = new ethers.Wallet(walletPrivateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const getTransactionCount = async () => {
    startingNonce = await provider.getTransactionCount(
      wallet.address,
      "pending"
    );
  };

  async function main() {
    const saleIsActive = !(await contract[publicMethodName]());

    await getTransactionCount();

    if (saleIsActive) {
      clearInterval(timer);

      setFeedback("Sale is open, trying to mint");

      contract[mintMethodName](...mintMethodArguments, {
        gasLimit: GAS_LIMIT,
        gasPrice: GAS_PRICE,
        nonce: startingNonce,
        value: (TOKEN_PRICE as any) * amount,
      })
        .then((data: any) => {
          const hash = data?.hash;
          console.log(data);
          if (hash) {
            setFeedback(
              `Minted successfully! \n\n Transaction hash:  \n ${hash}`
            );
          }
        })
        .catch((err: any) => {
          if (!err.message.includes("already known")) {
            setFeedback(`Error, please try again`);
          }
        });
    } else {
      setFeedback(`Minting is not live, trying again, ${time} s`);
    }
  }

  let startingNonce: any;
  let timer: any;

  let time = 0;

  (async () => {
    timer = setInterval(async () => {
      time += 1;
      main();
    }, INTERVAL);
  })();
};
