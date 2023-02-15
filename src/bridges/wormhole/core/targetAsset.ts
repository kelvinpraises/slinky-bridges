import { Provider } from "@/contexts/EthereumWalletContext";
import {
  ChainId,
  EVMChainId,
  getForeignAssetAlgorand,
  getForeignAssetEth,
  getForeignAssetSolana,
  hexToUint8Array,
} from "@certusone/wormhole-sdk";
import { Connection } from "@solana/web3.js";
import algosdk from "algosdk";
import { ethers } from "ethers";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
  SOLANA_HOST,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from "../utils/consts";

/// Pass in a "Origin Chain" and an "Origin Asset" this can be got from the result of e.g evmOriginAsset() etc 
/// Where you pass in the Mint Address(es) (The Contract Address of Tokens, in multiple blockchains Yield the same assetAddress)
/// so Mint Address -> 

export async function algorandTargetAsset(
  originChain: ChainId,
  originAsset: string
) {
  try {
    const algodClient = new algosdk.Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const asset = await getForeignAssetAlgorand(
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      originChain,
      originAsset
    );

    const data = {
      doesExist: !!asset,
      address: asset === null ? asset : asset.toString(),
    };

    return data;
  } catch (e) {
    console.error("error getting foreign asset", e);
  }
}

export async function evmTargetAsset(
  targetChain: EVMChainId,
  provider: Provider,
  originChain: ChainId,
  originAsset: string
) {
  try {
    const asset = await getForeignAssetEth(
      getTokenBridgeAddressForChain(targetChain),
      provider!,
      originChain,
      hexToUint8Array(originAsset)
    );

    const data = {
      doesExist: asset !== ethers.constants.AddressZero,
      address: asset,
    };

    return data;
  } catch (e) {
    console.error("error getting foreign asset", e);
  }
}

export async function solanaTargetAsset(
  originChain: ChainId,
  originAsset: string
) {
  try {
    const connection = new Connection(SOLANA_HOST, "confirmed");

    const asset = await getForeignAssetSolana(
      connection,
      SOL_TOKEN_BRIDGE_ADDRESS,
      originChain,
      hexToUint8Array(originAsset)
    );

    const data = { doesExist: !!asset, address: asset };

    return data;
  } catch (e) {
    console.error("error getting foreign asset", e);
  }
}
