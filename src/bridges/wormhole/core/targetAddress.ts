import { ChainId, uint8ArrayToHex } from "@certusone/wormhole-sdk";
import { Accounts } from "@randlabs/myalgo-connect";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { decodeAddress } from "algosdk";
import { arrayify, zeroPad } from "@ethersproject/bytes";
import { solanaTargetAsset } from "./targetAsset";

export function algorandTargetAddress(address: string) {
  return uint8ArrayToHex(decodeAddress(address).publicKey);
}

export function evmTargetAddress(signerAddress: string) {
  return uint8ArrayToHex(zeroPad(arrayify(signerAddress), 32));
}

export async function solanaTargetAddress(
  originChain: ChainId,
  originAsset: string,
  solanaPK: PublicKey
) {
  try {
    const targetAsset = await solanaTargetAsset(originChain, originAsset);
    const associatedTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(targetAsset!.address!), // this might error
      solanaPK
    );
    return uint8ArrayToHex(zeroPad(associatedTokenAccount.toBytes(), 32));
  } catch (e) {}
}
