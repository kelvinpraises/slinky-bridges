import {
  ChainId,
  CHAIN_ID_SOLANA,
  getEmitterAddressAlgorand,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  hexToUint8Array,
  parseSequenceFromLogAlgorand,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  transferFromAlgorand,
  transferFromEth,
  transferFromEthNative,
  transferFromSolana,
  transferNativeSol,
  uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import algosdk from "algosdk";
import { Signer } from "ethers";
import { parseUnits, zeroPad } from "ethers/lib/utils";


import { signSendAndConfirmAlgorand } from "../utils/algorand";

import {
  ALGORAND_BRIDGE_ID,
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getBridgeAddressForChain,
  getTokenBridgeAddressForChain,
  SOLANA_HOST,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from "../utils/consts";

import parseError from "../utils/parseError";
import { signSendAndConfirm } from "../utils/solana";
import { fetchSignedVAA } from "./vaa";

function handleError(e: any) {
  console.error(e);
  alert(parseError(e));
  // SET TX SENDING FALSE
  // SET VAA LOADING FALSE
}

export async function algoTransfer(
  senderAddr: string,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  chainId: ChainId,
  relayerFee?: string
) {
  // SET TX SENDING TRUE
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed) ;
    const algodClient = new algosdk.Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const txs = await transferFromAlgorand(
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      ALGORAND_BRIDGE_ID,
      senderAddr,
      BigInt(tokenAddress),
      transferAmountParsed.toBigInt(),
      uint8ArrayToHex(recipientAddress),
      recipientChain,
      feeParsed.toBigInt()
    );
    const result = await signSendAndConfirmAlgorand(algodClient, txs);
    const sequence = parseSequenceFromLogAlgorand(result);

    const transferTX = {
      id: txs[txs.length - 1].tx.txID(),
      block: result["confirmed-round"],
    };

    alert("Transaction confirmed");

    const emitterAddress = getEmitterAddressAlgorand(ALGORAND_TOKEN_BRIDGE_ID);
    await fetchSignedVAA(chainId, emitterAddress, sequence);
  } catch (e) {
    handleError(e);
  }
}

export async function evmTransfer(
  signer: Signer,
  tokenAddress: string,
  decimals: number,
  amount: string,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  isNative: boolean,
  chainId: ChainId,
  relayerFee?: string
) {
  // SET TX SENDING TRUE
  try {
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const receipt = isNative
      ? await transferFromEthNative(
          getTokenBridgeAddressForChain(chainId),
          signer,
          transferAmountParsed,
          recipientChain,
          recipientAddress
        )
      : await transferFromEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          tokenAddress,
          transferAmountParsed,
          recipientChain,
          recipientAddress
        );

    const transferTx = {
      id: receipt.transactionHash,
      block: receipt.blockNumber,
    };

    alert("Transaction confirmed");

    const sequence = parseSequenceFromLogEth(
      receipt,
      getBridgeAddressForChain(chainId)
    );
    const emitterAddress = getEmitterAddressEth(
      getTokenBridgeAddressForChain(chainId)
    );
    await fetchSignedVAA(chainId, emitterAddress, sequence);
  } catch (e) {
    handleError(e);
  }
}

export async function solanaTransfer(
  wallet: WalletContextState,
  payerAddress: string,
  fromAddress: string,
  mintAddress: string,
  amount: string,
  decimals: number,
  recipientChain: ChainId,
  recipientAddress: Uint8Array,
  isNative: boolean,
  originAddressStr?: string,
  originChain?: ChainId,
  relayerFee?: string
) {
  // SET TX SENDING TRUE
  try {
    const connection = new Connection(SOLANA_HOST, "confirmed");
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits(relayerFee || "0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const originAddress = originAddressStr
      ? zeroPad(hexToUint8Array(originAddressStr), 32)
      : undefined;
    const promise = isNative
      ? transferNativeSol(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          transferAmountParsed.toBigInt(),
          recipientAddress,
          recipientChain,
          feeParsed.toBigInt()
        )
      : transferFromSolana(
          connection,
          SOL_BRIDGE_ADDRESS,
          SOL_TOKEN_BRIDGE_ADDRESS,
          payerAddress,
          fromAddress,
          mintAddress,
          transferAmountParsed.toBigInt(),
          recipientAddress,
          recipientChain,
          originAddress,
          originChain,
          undefined,
          feeParsed.toBigInt()
        );
    const transaction = await promise;
    const txid = await signSendAndConfirm(wallet, connection, transaction);

    alert("Transaction confirmed");

    const info = await connection.getTransaction(txid);
    if (!info) {
      throw new Error("An error occurred while fetching the transaction info");
    }

    const transferTx = {
      id: txid,
      block: info.slot,
    };

    const sequence = parseSequenceFromLogSolana(info);
    const emitterAddress = await getEmitterAddressSolana(
      SOL_TOKEN_BRIDGE_ADDRESS
    );
    await fetchSignedVAA(CHAIN_ID_SOLANA, emitterAddress, sequence);
  } catch (e) {
    handleError(e);
  }
}
