import { NetworkGraph } from "@/bridges/shared";
import { NetworkType, TokenType } from "@/data/config";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;
const { xALGO, ALGO } = TokenType;

const algorand: NetworkGraph = {
  name: ALGORAND,
  tokens: {
    [ALGO]: {
      bridgeAddress: "0x00",
      autoRedeem: false,
      targetNetworks: [
        {
          token: xALGO,
          network: ETHEREUM,
          bridgeAddress: "0x00",
        },
        {
          token: xALGO,
          network: SOLANA,
          bridgeAddress: "0x00",
        },
      ],
    },
  },
};

export default algorand;
