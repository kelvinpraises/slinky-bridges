import { BridgeDetails } from "./shared";
import { wormholeDetails } from "./wormhole";

export {
  algorandBridge as wormholeAlgorandBridge,
  ethereumBridge as wormholeEthereumBridge,
  solanaBridge as wormholeSolanaBridge,
} from "./wormhole/core/bridgeTokens";

const bridges: BridgeDetails[] = [wormholeDetails]; // TODO: glitterBridgeDetails will add once ready!

export default bridges;
