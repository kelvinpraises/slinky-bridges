import { Provider } from "@/contexts/EthereumWalletContext";

import {
  ChainId,
  EVMChainId,
  getOriginalAssetAlgorand,
  getOriginalAssetEth,
  getOriginalAssetSol,
  uint8ArrayToHex, 
} from "@certusone/wormhole-sdk";
import { Connection } from "@solana/web3.js";
import { Algodv2 } from "algosdk";
import {
  ALGORAND_HOST,
  ALGORAND_TOKEN_BRIDGE_ID,
  getTokenBridgeAddressForChain,
  SOLANA_HOST,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from "../utils/consts";

export interface AssetInfo {
  isSourceAssetWormholeWrapped: boolean;
  originChain: ChainId;
  originAsset: string;
}

/// Note that the same Asset would have multiple Mint Addresses because it's bridged on multiple blockchains
/// Pass in Mint Address (The Contract Address of The Token on The Blockchain) to get back info about the token
///
/// "isSourceAssetWormholeWrapped" represents whether this Mint Address is a Bridged version or the Original Version.
/// "originChain" shows what chain it originated from.
/// "originAsset" (better as The Asset) can be thought of as the Id of what is being bridged remember on multiple BLockchains 
/// it's impossible to give it a similar Contract Address to a Bridged Token on multiple Blockchain but having a Asset Id helps with unifying the bridges.
/// the asset Id us usually be based on the Origin Chain Token Contract Address details!

export async function algorandOriginAsset(mintAddress: string) {
  try {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );

    const wrappedInfo = await getOriginalAssetAlgorand(
      algodClient,
      ALGORAND_TOKEN_BRIDGE_ID,
      BigInt(mintAddress)
    );

    const { isWrapped, chainId, assetAddress } = wrappedInfo;

    const assetInfo: AssetInfo = {
      isSourceAssetWormholeWrapped: isWrapped,
      originChain: chainId,
      originAsset: uint8ArrayToHex(assetAddress),
    };

    return assetInfo;
  } catch (e) {}
}

export async function evmOriginAsset(
  mintAddress: string,
  sourceChain: EVMChainId,
  provider: Provider
) {
  try {
    const wrappedInfo = await getOriginalAssetEth(
      getTokenBridgeAddressForChain(sourceChain),
      provider!,
      mintAddress,
      sourceChain
    );

    const { isWrapped, chainId, assetAddress } = wrappedInfo;

    const assetInfo: AssetInfo = {
      isSourceAssetWormholeWrapped: isWrapped,
      originChain: chainId,
      originAsset: uint8ArrayToHex(assetAddress),
    };

    return assetInfo;
  } catch (e) {}
}

export async function solanaOriginAsset(mintAddress: string) {
  try {
    const connection = new Connection(SOLANA_HOST, "confirmed");
    const wrappedInfo = await getOriginalAssetSol(
      connection,
      SOL_TOKEN_BRIDGE_ADDRESS,
      mintAddress
    );

    const { isWrapped, chainId, assetAddress } = wrappedInfo;

    const assetInfo: AssetInfo = {
      isSourceAssetWormholeWrapped: isWrapped,
      originChain: chainId,
      originAsset: uint8ArrayToHex(assetAddress),
    };

    return assetInfo;
  } catch (e) {}
}

