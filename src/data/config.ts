export enum BridgeType {
  WORMHOLE = "Wormhole",
  GLITTER_BRIDGE = "Glitter Bridge",
}

export enum NetworkType {
  ALGORAND = "Algorand",
  ETHEREUM = "Ethereum",
  SOLANA = "Solana",
}

export enum TokenType {
  ALGO = "Algo",
  ALGOWormhole = "Algo (Wormhole)",
  ETH = "Eth",
  SOL = "Sol",
  WSOL = "WSol",
  USDC = "USDC",
  USDCWormhole = "USD Coin (Wormhole)",
  USDT = "USDT",
  WETH = "WETH",
}

export enum BridgeBlockType {
  ORIGIN = "ORIGIN",
  TARGET = "TARGET",
}

const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;

export type INetworkDetails = {
  readonly [key in NetworkType]: {
    id: NetworkType;
    name: NetworkType;
    logo: string;
  };
};

export const networkDetails: INetworkDetails = {
  [ALGORAND]: {
    id: ALGORAND,
    name: ALGORAND,
    logo: "/icons/algorand.svg",
  },
  [ETHEREUM]: {
    id: ETHEREUM,
    name: ETHEREUM,
    logo: "/icons/eth.svg",
  },
  [SOLANA]: {
    id: SOLANA,
    name: SOLANA,
    logo: "/icons/solana.svg",
  },
};

const {
  ALGOWormhole,
  ALGO,
  ETH,
  SOL,
  WSOL,
  USDC,
  USDCWormhole,
  USDT,
  WETH,
} = TokenType;

export type ITokenDetails = {
  readonly [key in TokenType]: {
    id: TokenType;
    name: TokenType;
    logo: string;
  };
};

export const tokenDetails: ITokenDetails = {
  [ALGO]: {
    id: ALGO,
    name: ALGO,
    logo: "/icons/algorand.svg",
  },
  [ALGOWormhole]: {
    id: ALGOWormhole,
    name: ALGOWormhole,
    logo: "/icons/algorand.svg",
  },
  [USDCWormhole]: {
    id: USDCWormhole,
    name: USDCWormhole,
    logo: "/icons/usdc.svg",
  },
  [ETH]: {
    id: ETH,
    name: ETH,
    logo: "/icons/eth.svg",
  },
  [SOL]: {
    id: SOL,
    name: SOL,
    logo: "/icons/solana.svg",
  },
  [WSOL]: {
    id: WSOL,
    name: WSOL,
    logo: "/icons/solana.svg",
  },
  [USDC]: {
    id: USDC,
    name: USDC,
    logo: "/icons/usdc.svg",
  },
  [USDT]: {
    id: USDT,
    name: USDT,
    logo: "/icons/usdt.svg",
  },
  [WETH]: {
    id: WETH,
    name: WETH,
    logo: "/icons/eth.svg",
  },
};
