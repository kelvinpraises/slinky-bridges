import { NetworkType } from "@/data/config";
import { ChainId } from "@certusone/wormhole-sdk";

export function toChainId(networkType: NetworkType) {
  let chainId: ChainId;

  switch (networkType) {
    case NetworkType.ALGORAND:
      chainId = 8;
      break;

    case NetworkType.ETHEREUM:
      chainId = 2;
      break;

    case NetworkType.SOLANA:
      chainId = 1;
      break;
  }

  return chainId;
}
