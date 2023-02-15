import { NetworkGraph } from "@/bridges/shared";
import { NetworkType, TokenType } from "@/data/config";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;
const { ALGO, ALGOWormhole } = TokenType;

const algorand: NetworkGraph = {
  name: ALGORAND,
  tokens: {
    [ALGO]: {
      mintAddress: "0x00",
      autoRedeem: false,
      targetNetworks: [
        {
          token: ALGOWormhole,
          network: ETHEREUM,
        },
        {
          token: ALGOWormhole,
          network: SOLANA,
        },
      ],
    },
  },
};

export default algorand;
