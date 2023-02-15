import { Provider } from "@/contexts/EthereumWalletContext";
import { NetworkType } from "@/data/config";
import { ChainId, hexToUint8Array } from "@certusone/wormhole-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Signer } from "ethers";
import { toChainId } from "../utils/toChainId";
import {
  algorandOriginAsset,
  evmOriginAsset,
  solanaOriginAsset,
} from "./originAsset";
import {
  algorandTargetAddress,
  evmTargetAddress,
  solanaTargetAddress,
} from "./targetAddress";
import { getSolanaTokenAccount } from "./targetTokenAccount";
import { algoTransfer, evmTransfer, solanaTransfer } from "./transfer";

export async function ethereumBridge({
  signer,
  amount,
  tokenAddress,
  decimals,
  isNative,
  recipientChain,
  recipientAddress,
  solanaPk,
  provider,
}: {
  signer: Signer; // ✅ <<<<<<<,
  amount: string; // <<<<<<<
  tokenAddress: string; // ✅ mintKey
  decimals: number;
  isNative: boolean;
  recipientChain: NetworkType; // ✅ NetworkType <<<<<<<
  recipientAddress: string; // ✅ <<<<<<<
  solanaPk?: PublicKey;
  provider?: Provider;
}) {
  // 1. Get Origin Asset: pass mint to evmOriginAsset() and get origin asset
  // 2. Get Target Asset: whatever target chain is pass the origin asset and origin chain to it e.g solanaTargetAsset()
  // 3. Get Target Token Account:
  // 4. Set Target Address as Hex by calling solanaTargetAddress() if solana is the target address
  // 5. Resolve NetworkType to ChainId

  const originChain = 2;

  let recipientChainId: ChainId | null = null;
  let arrayRecipientAddress: Uint8Array | null = null;

  if (recipientChain === NetworkType.ALGORAND) {
    recipientChainId = toChainId(recipientChain);
    arrayRecipientAddress = hexToUint8Array(
      algorandTargetAddress(recipientAddress)
    );
  }

  if (recipientChain === NetworkType.SOLANA) {
    if (!solanaPk) throw new Error("Solana Public Key Not Passed");

    const originAsset = await evmOriginAsset(
      tokenAddress,
      originChain,
      provider
    );

    recipientChainId = toChainId(recipientChain);

    arrayRecipientAddress = hexToUint8Array(
      (await solanaTargetAddress(
        originChain,
        originAsset?.originAsset!,
        solanaPk
      )) || ""
    );
  }

  const data =
    recipientChainId &&
    arrayRecipientAddress &&
    (await evmTransfer(
      signer,
      tokenAddress,
      decimals,
      amount,
      recipientChainId,
      arrayRecipientAddress,
      isNative,
      originChain
    ));

  return data;
}

export async function algorandBridge({
  senderAddress,
  amount,
  tokenAddress,
  decimals,
  recipientChain,
  recipientAddress,
  solanaPk,
}: {
  senderAddress: string;
  amount: string;
  tokenAddress: string;
  decimals: number;
  recipientChain: NetworkType;
  recipientAddress?: string;
  solanaPk?: PublicKey;
}) {
  const originChain = 8;

  let recipientChainId: ChainId | null = null;
  let arrayRecipientAddress: Uint8Array | null = null;

  if (recipientChain === NetworkType.ETHEREUM) {
    if (!recipientAddress)
      throw new Error("Ethereum Recipient Address Not Passed");

    recipientChainId = toChainId(recipientChain);
    arrayRecipientAddress = hexToUint8Array(evmTargetAddress(recipientAddress));
  }

  if (recipientChain === NetworkType.SOLANA) {
    if (!solanaPk) throw new Error("Solana Public Key Not Passed");

    const originAsset = await algorandOriginAsset(tokenAddress);

    recipientChainId = toChainId(recipientChain);

    arrayRecipientAddress = hexToUint8Array(
      (await solanaTargetAddress(
        originChain,
        originAsset?.originAsset!,
        solanaPk
      )) || ""
    );
  }

  const data =
    recipientChainId &&
    arrayRecipientAddress &&
    (await algoTransfer(
      senderAddress,
      tokenAddress,
      decimals,
      amount,
      recipientChainId,
      arrayRecipientAddress,
      originChain
    ));

  return data;
}

export async function solanaBridge({
  wallet,
  payerAddress,
  amount,
  tokenAddress,
  isNative,
  decimals,
  recipientChain,
  recipientAddress,
  solanaPk,
}: {
  wallet: WalletContextState;
  payerAddress: string;
  amount: string;
  tokenAddress: string;
  isNative: boolean;
  decimals: number;
  recipientChain: NetworkType;
  recipientAddress: string;
  solanaPk: PublicKey;
}) {
  let recipientChainId: ChainId | null = null;
  let arrayRecipientAddress: Uint8Array | null = null;

  if (recipientChain === NetworkType.ETHEREUM) {
    recipientChainId = toChainId(recipientChain);
    arrayRecipientAddress = hexToUint8Array(evmTargetAddress(recipientAddress));
  }

  if (recipientChain === NetworkType.ALGORAND) {
    recipientChainId = toChainId(recipientChain);
    arrayRecipientAddress = hexToUint8Array(
      algorandTargetAddress(recipientAddress)
    );
  }

  const acc = await getSolanaTokenAccount(tokenAddress, solanaPk);
  const asset = await solanaOriginAsset(tokenAddress);

  const data =
    recipientChainId &&
    arrayRecipientAddress &&
    (await solanaTransfer(
      wallet,
      payerAddress,
      acc?.publicKey!,
      tokenAddress,
      amount,
      decimals,
      recipientChainId,
      arrayRecipientAddress,
      isNative,
      asset?.originAsset,
      asset?.originChain
    ));

  return data;
}
