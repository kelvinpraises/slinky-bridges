export {};

const solana = {
  mintKey: "So11111111111111111111111111111111111111112",
  sourceChain: 1,
};

const solanaWrappedEther = {
  mintKey: "7VPWjBhCXrpYYBiRKZh1ubh9tLZZNkZGp2ReRphEV4Mc",
  sourceChain: 1,
};

const wrappedEther = {
  mintKey: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
  decimals: 18,
  isNativeAsset: true,
  sourceChain: 2,
};

function ethereumBridge(
  signer: Signer, // ✅ <<<<<<<
  tokenAddress: string, // ✅ mintKey
  decimals: number, // ✅ 
  amount: string, // <<<<<<<
  recipientChain: ChainId, // ✅ NetworkType <<<<<<<
  recipientAddress: Uint8Array, // ✅ <<<<<<<
  isNative: boolean, // ✅
  chainId: ChainId, // ✅
  relayerFee?: string
) {

}

// store mint keys instead



// 1