import {
  wormholeAlgorandBridge,
  wormholeEthereumBridge,
  wormholeSolanaBridge,
} from "@/bridges";
import { useAlgorandContext } from "@/contexts/AlgorandWalletContext";
import { useEthereumProvider } from "@/contexts/EthereumWalletContext";
import { useSolanaWallet } from "@/contexts/SolanaWalletContext";
import { NetworkType } from "@/data/config";
import { useStore } from "@/store/useStore";
import { useCallback, useMemo } from "react";

export function useWormHoleBridge() {
  const originNetworkType = useStore((state) => state.originNetworkType);
  const originTokenType = useStore((state) => state.originTokenType);
  const originTokenAmount = useStore((state) => state.originTokenAmount);
  const targetNetworkType = useStore((state) => state.targetNetworkType);
  const { signer, signerAddress, provider } = useEthereumProvider();
  const { accounts: algoAccounts } = useAlgorandContext();
  const solanaWallet = useSolanaWallet();
  const { publicKey, disconnect: disconnectSolana } = useSolanaWallet();

  const publicKeyBase58 = useMemo(() => {
    return publicKey?.toBase58() || "";
  }, [publicKey]);

  const bridgeToken = useCallback(async () => {
    if (originNetworkType === NetworkType.ALGORAND) {
      if (targetNetworkType === NetworkType.ETHEREUM) {
        await wormholeAlgorandBridge({
          senderAddress: algoAccounts[0].address,
          amount: originTokenAmount,
          tokenAddress: "",
          decimals: 0,
          recipientChain: targetNetworkType,
          recipientAddress: signerAddress,
        });
      } else if (targetNetworkType === NetworkType.SOLANA) {
        await wormholeAlgorandBridge({
          senderAddress: algoAccounts[0].address,
          amount: originTokenAmount,
          tokenAddress: "",
          decimals: 0,
          recipientChain: targetNetworkType,
          solanaPk: publicKey!,
        });
      }
    }

    if (originNetworkType === NetworkType.ETHEREUM) {
      if (targetNetworkType === NetworkType.ALGORAND) {
        await wormholeEthereumBridge({
          signer: signer!,
          amount: originTokenAmount,
          tokenAddress: "",
          decimals: 0,
          isNative: false,
          recipientChain: targetNetworkType,
          recipientAddress: algoAccounts[0].address,
        });
      } else if (targetNetworkType === NetworkType.SOLANA) {
        await wormholeEthereumBridge({
          signer: signer!,
          amount: originTokenAmount,
          tokenAddress: "",
          decimals: 0,
          isNative: false,
          recipientChain: targetNetworkType,
          recipientAddress: publicKeyBase58,
          solanaPk: publicKey!,
          provider,
        });
      }
    }

    if (originNetworkType === NetworkType.SOLANA) {
      if (targetNetworkType === NetworkType.ALGORAND) {
        await wormholeSolanaBridge({
          wallet: solanaWallet,
          payerAddress: publicKey!.toString(),
          amount: originTokenAmount,
          tokenAddress: "",
          isNative: false,
          decimals: 0,
          recipientChain: targetNetworkType,
          recipientAddress: algoAccounts[0].address,
          solanaPk: publicKey!,
        });
      } else if (targetNetworkType === NetworkType.ETHEREUM) {
        await wormholeSolanaBridge({
          wallet: solanaWallet,
          payerAddress: publicKey!.toString(),
          amount: originTokenAmount,
          tokenAddress: "7VPWjBhCXrpYYBiRKZh1ubh9tLZZNkZGp2ReRphEV4Mc",
          isNative: false,
          decimals: 8,
          recipientChain: targetNetworkType,
          recipientAddress: signerAddress!,
          solanaPk: publicKey!,
        });
      }
    }
  }, [
    originNetworkType,
    originTokenAmount,
    targetNetworkType,
    signer,
    provider,
    solanaWallet,
    publicKey,
    disconnectSolana,
    publicKeyBase58,
  ]);

  const redeemToken = useCallback(() => {}, []);

  return { bridgeToken, redeemToken };
}
