import { NetworkGraph } from "@/bridges/shared";
import { NetworkType, TokenType } from "@/data/config";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;
const { WETH, ETH, USDC, USDCWormhole } = TokenType;

const ethereum: NetworkGraph = {
  name: ETHEREUM,
  tokens: {
    [ETH]: {
      mintAddress: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      autoRedeem: false,
      targetNetworks: [
        {
          token: WETH,
          network: ALGORAND,
        },
        {
          token: WETH,
          network: SOLANA,
        },
      ],
    },
    [USDC]: {
      mintAddress: "0x00",
      autoRedeem: false,
      targetNetworks: [
        {
          token: USDCWormhole,
          network: ALGORAND,
        },
        {
          token: USDCWormhole,
          network: SOLANA,
        },
      ],
    },
  },
};

export default ethereum;
