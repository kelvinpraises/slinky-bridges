import {
  ChainId,
  getForeignAssetSolana,
  hexToUint8Array
} from "@certusone/wormhole-sdk";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import { SOLANA_HOST, SOL_TOKEN_BRIDGE_ADDRESS } from "./consts";

export async function signSendAndConfirm(
  wallet: WalletContextState,
  connection: Connection,
  transaction: Transaction
) {
  if (!wallet.signTransaction) {
    throw new Error("wallet.signTransaction is undefined");
  }
  const signed = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid);
  return txid;
}

export interface ExtractedMintInfo {
  mintAuthority?: string;
  supply?: string;
}

export function extractMintInfo(
  account: AccountInfo<Buffer>
): ExtractedMintInfo {
  const data = Buffer.from(account.data);
  const mintInfo = MintLayout.decode(data);

  const uintArray = mintInfo?.mintAuthority;
  const pubkey = new PublicKey(uintArray);
  const supply = BigInt(mintInfo?.supply.reverse()).toString();
  const output = {
    mintAuthority: pubkey?.toString(),
    supply: supply.toString(),
  };

  return output;
}

export async function getMultipleAccountsRPC(
  connection: Connection,
  pubkeys: PublicKey[]
): Promise<(AccountInfo<Buffer> | null)[]> {
  return getMultipleAccounts(connection, pubkeys, "confirmed");
}

export const getMultipleAccounts = async (
  connection: any,
  pubkeys: PublicKey[],
  commitment: string
) => {
  return (
    await Promise.all(
      chunks(pubkeys, 99).map((chunk) =>
        connection.getMultipleAccountsInfo(chunk, commitment)
      )
    )
  ).flat();
};

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export function shortenAddress(address: string) {
  return address.length > 10
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : address;
}

export async function getAssociatedTokenAddress(
  originChain: ChainId,
  originAsset: string,
  solanaPK: PublicKey
) {
  const connection = new Connection(SOLANA_HOST, "confirmed");

  const solanaMintKey = new PublicKey(
    (await getForeignAssetSolana(
      connection,
      SOL_TOKEN_BRIDGE_ADDRESS,
      originChain,
      hexToUint8Array(originAsset)
    )) || ""
  );
  const recipientAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    solanaMintKey,
    solanaPK
  );

  return recipientAddress;
}
