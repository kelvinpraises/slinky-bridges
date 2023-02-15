import { Adapter } from "@solana/wallet-adapter-base";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { useMemo } from "react";
import { SOLANA_HOST } from "../bridges/wormhole/utils/consts";

export const SolanaWalletProvider = (props: any) => {
  const wallets = useMemo(() => {
    const wallets: Adapter[] = [
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new PhantomWalletAdapter(),
    ];
    return wallets;
  }, []);

  return (
    <ConnectionProvider endpoint={SOLANA_HOST}>
      <WalletProvider wallets={wallets} autoConnect>
        {props.children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useSolanaWallet = useWallet;
