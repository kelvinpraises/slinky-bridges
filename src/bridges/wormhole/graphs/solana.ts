import { NetworkGraph } from "@/bridges/shared";
import { NetworkType, TokenType } from "@/data/config";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;
const { SOL, WSOL } = TokenType;

const solana: NetworkGraph = {
  name: SOLANA,
  tokens: {
    [SOL]: {
      mintAddress: "0x00",
      autoRedeem: false,
      targetNetworks: [
        {
          token: WSOL,
          network: ALGORAND,
        },
        {
          token: WSOL,
          network: ETHEREUM,
        },
      ],
    },
  },
};

export default solana;
