import { TokenType } from "@/data/config";
import { ChainId } from "@certusone/wormhole-sdk";

export function toChainId(tokenType: TokenType) {
  let chainId: ChainId;

  switch (tokenType) {
    case TokenType.ALGO:
      chainId = 8;
      break;

    case TokenType:
      chainId = 2;
      break;

    case TokenType.SOLANA:
      chainId = 1;
      break;
  }

  return chainId;
}

