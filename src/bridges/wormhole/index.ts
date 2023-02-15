import { BridgeType, NetworkType } from "../../data/config";
import { BridgeDetails } from "../shared";
import { algorand, ethereum, solana } from "./graphs";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;

export const wormholeDetails: BridgeDetails = {
  name: BridgeType.WORMHOLE,
  icon: "",
  networks: {
    [ALGORAND]: algorand,
    [ETHEREUM]: ethereum,
    [SOLANA]: solana,
  },
};

function status() {
  throw new Error("Function not implemented.");
}

function fee() {
  throw new Error("Function not implemented.");
}

interface Limit {
  amount: number;
  token: string;
}

function limit(x: Limit) {
  throw new Error("Function not implemented.");
}
