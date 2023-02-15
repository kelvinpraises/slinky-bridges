import { useAlgorandContext } from "@/contexts/AlgorandWalletContext";
import { useEthereumProvider } from "@/contexts/EthereumWalletContext";
import { useSolanaWallet } from "@/contexts/SolanaWalletContext";
import { NetworkType } from "@/data/config";
import { useStore } from "@/store/useStore";
import { validateStateData } from "@/utils/zod";
import { useMemo } from "react";

export function useStateInfo() {
  const originNetworkType = useStore((state) => state.originNetworkType);
  const originTokenType = useStore((state) => state.originTokenType);
  const originTokenAmount = useStore((state) => state.originTokenAmount);
  const targetNetworkType = useStore((state) => state.targetNetworkType);
  const targetTokenType = useStore((state) => state.targetTokenType);
  const targetTokenAmount = useStore((state) => state.targetTokenAmount);

  const isStateValid = useMemo(
    () =>
      validateStateData({
        originNetworkType,
        originTokenType,
        originTokenAmount,
        targetNetworkType,
        targetTokenType,
        targetTokenAmount,
      }),
    [
      originNetworkType,
      originTokenType,
      originTokenAmount,
      targetNetworkType,
      targetTokenType,
      targetTokenAmount,
    ]
  );

  return { isStateValid };
}

export function useWalletConnectionInfo() {
  const { ALGORAND, ETHEREUM, SOLANA } = NetworkType;

  const originNetworkType = useStore((state) => state.originNetworkType);
  const targetNetworkType = useStore((state) => state.targetNetworkType);

  const { wallet } = useSolanaWallet();
  const { signerAddress } = useEthereumProvider();
  const { accounts } = useAlgorandContext();

  const areWalletsConnected = useMemo(() => {
    let length = 0;

    type IConnections = {
      [key in NetworkType]: {
        connection: boolean;
        networkType: NetworkType;
      };
    };

    const connections: IConnections = {
      [ALGORAND]: {
        connection: !!accounts[0],
        networkType: ALGORAND,
      },
      [ETHEREUM]: {
        connection: !!signerAddress,
        networkType: ETHEREUM,
      },
      [SOLANA]: {
        connection: !!wallet?.adapter.connected,
        networkType: SOLANA,
      },
    };

    Object.values(connections).forEach((c) => {
      if (c.networkType === originNetworkType && c.connection) {
        length += 1;
      }
    });

    Object.values(connections).forEach((c) => {
      if (c.networkType === targetNetworkType && c.connection) {
        length += 1;
      }
    });

    return length === 2 ? true : false;
  }, [originNetworkType, targetNetworkType, wallet, signerAddress, accounts]);

  return { areWalletsConnected };
}
