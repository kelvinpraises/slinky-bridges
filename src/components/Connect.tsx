import { getEvmChainId } from "@/bridges/wormhole/utils/consts";
import { useAlgorandContext } from "@/contexts/AlgorandWalletContext";
import {
  ConnectType,
  useEthereumProvider,
} from "@/contexts/EthereumWalletContext";
import { useSolanaWallet } from "@/contexts/SolanaWalletContext";
import { BridgeBlockType, NetworkType } from "@/data/config";
import { EVM_RPC_MAP } from "@/utils/metaMaskChainParameters";
import { Close } from "@radix-ui/react-dialog";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import styled from "styled-components";
import Button from "./Button";
import ConnectWalletToggle from "./ConnectWalletToggle";

interface IConnect {
  networkType: NetworkType | null;
  bridgeBlockType: BridgeBlockType;
}

function Connect({ networkType, bridgeBlockType }: IConnect) {
  /* ALGORAND */

  const {
    disconnect: disconnectAlgorand,
    accounts,
    connect: connectAlgorand,
  } = useAlgorandContext();

  const availableAlgorandWallets = (
    <Close asChild>
      <SWallet onClick={connectAlgorand}>Myalgo</SWallet>
    </Close>
  );

  /* ETHEREUM */

  const {
    disconnect: disconnectEthereum,
    signerAddress,
    providerError,
    availableConnections,
    connect: connectEthereum,
  } = useEthereumProvider();

  const availableEthereumWallets = availableConnections
    .filter((connection) => {
      if (connection.connectType === ConnectType.METAMASK) {
        return true;
      } else if (connection.connectType === ConnectType.WALLETCONNECT) {
        const evmChainId = getEvmChainId(5);
        // WalletConnect requires a rpc provider
        return (
          evmChainId !== undefined && EVM_RPC_MAP[evmChainId] !== undefined
        );
      } else {
        return false;
      }
    })
    .map((connection) => {
      return (
        <Close key={connection.name} asChild>
          <SWallet onClick={() => connectEthereum(connection.connectType)}>
            {connection.name}
          </SWallet>
        </Close>
      );
    });

  /* SOLANA */

  const { publicKey, wallet, disconnect: disconnectSolana } = useSolanaWallet();

  const publicKeyBase58 = useMemo(() => {
    return publicKey?.toBase58() || "";
  }, [publicKey]);

  const { wallets, select } = useWallet();

  const [detected, undetected] = useMemo(() => {
    const detected: Wallet[] = [];
    const undetected: Wallet[] = [];
    for (const wallet of wallets) {
      if (
        wallet.readyState === WalletReadyState.Installed ||
        wallet.readyState === WalletReadyState.Loadable
      ) {
        detected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.NotDetected) {
        undetected.push(wallet);
      }
    }
    return [detected, undetected];
  }, [wallets]);

  const availableSolanaWallets = detected.map((wallet) => (
    <Close key={wallet.adapter.name} asChild>
      <SWallet onClick={() => select(wallet.adapter.name)}>
        {wallet.adapter.name}
      </SWallet>
    </Close>
  ));

  /* UI */

  if (networkType === NetworkType.ALGORAND) {
    return (
      <ConnectWalletToggle
        disconnect={disconnectAlgorand}
        connected={!!accounts[0]}
        pk={accounts[0]?.address || ""}
        bridgeBlockType={bridgeBlockType}
      >
        {availableAlgorandWallets}
      </ConnectWalletToggle>
    );
  }

  if (networkType === NetworkType.ETHEREUM) {
    return (
      <ConnectWalletToggle
        disconnect={disconnectEthereum}
        connected={!!signerAddress}
        pk={signerAddress || ""}
        bridgeBlockType={bridgeBlockType}
      >
        {availableEthereumWallets}
      </ConnectWalletToggle>
    );
  }

  if (networkType === NetworkType.SOLANA) {
    return (
      <ConnectWalletToggle
        disconnect={disconnectSolana}
        connected={!!wallet?.adapter.connected}
        pk={publicKeyBase58}
        bridgeBlockType={bridgeBlockType}
      >
        {availableSolanaWallets}
      </ConnectWalletToggle>
    );
  }

  return (
    <>
      <SButton isDisabled={true}>CONNECT WALLET</SButton>
    </>
  );
}

export default Connect;

const SButton = styled(Button)`
  margin-bottom: 1rem;
`;

const SWallet = styled.div`
  color: green;
  font-size: 13px;
  line-height: 18px;
  margin-top: 10px;
  border-top: 1px solid green;
  padding-top: 10px;
`;
