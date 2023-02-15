import { BridgeType, NetworkType } from "../../data/config";
import algorand from "./graphs/algorand";

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;

export const glitterBridgeDetails = {
  name: BridgeType.GLITTER_BRIDGE,
  networks: {
    [ALGORAND]: algorand,
    [ETHEREUM]: null,
    [SOLANA]: null,
  },
};
