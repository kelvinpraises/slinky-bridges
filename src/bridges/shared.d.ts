import { BridgeType, NetworkType, TokenType } from "@/data/config";
import { ValueOf } from "next/dist/shared/lib/constants";

export interface BridgeDetails {
  name: BridgeType;
  icon: string;
  networks: {
    readonly [key in NetworkType]?: NetworkGraph;
  };
}

export interface NetworkGraph {
  name: NetworkType;
  tokens: {
    readonly [key in TokenType]?: {
      mintAddress: string;
      autoRedeem: boolean;
      targetNetworks: {
        token: TokenType;
        network: NetworkType;
        bridgeBack?: boolean;
      }[];
    };
  };
}
