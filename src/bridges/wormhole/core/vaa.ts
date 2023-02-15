import {
  ChainId,
  ChainName,
  getGovernorIsVAAEnqueued,
  getSignedVAA
} from "@certusone/wormhole-sdk";
import { WORMHOLE_RPC_HOSTS } from "../utils/consts";

export interface GetSignedVAAWithRetryResult {
  vaaBytes: Uint8Array | undefined;
  isPending: boolean;
}

export async function getSignedVAAWithRetry(
  emitterChain: ChainId | ChainName,
  emitterAddress: string,
  sequence: string,
  retryAttempts?: number
): Promise<GetSignedVAAWithRetryResult> {
  let currentWormholeRpcHost = -1;
  const getNextRpcHost = () =>
    ++currentWormholeRpcHost % WORMHOLE_RPC_HOSTS.length;
  let attempts = 0;
  while (true) {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const rpcHost = WORMHOLE_RPC_HOSTS[getNextRpcHost()];
    const results = await Promise.allSettled([
      getSignedVAA(rpcHost, emitterChain, emitterAddress, sequence),
      getGovernorIsVAAEnqueued(rpcHost, emitterChain, emitterAddress, sequence),
    ]);
    if (results[0].status === "fulfilled") {
      return { vaaBytes: results[0].value.vaaBytes, isPending: false };
    }
    if (results[1].status === "fulfilled" && results[1].value.isEnqueued) {
      return { vaaBytes: undefined, isPending: true };
    }
    if (retryAttempts !== undefined && attempts > retryAttempts) {
      throw new Error(results[0].reason);
    }
  }
}

export async function fetchSignedVAA(
  chainId: ChainId,
  emitterAddress: string,
  sequence: string
) {
  alert("Fetching VAA");
  const { vaaBytes, isPending } = await getSignedVAAWithRetry(
    chainId,
    emitterAddress,
    sequence
  );

  if (vaaBytes !== undefined) {
    // SAVE uint8ArrayToHex(vaaBytes)
    // SET VAA LOADING FALSE
    alert("Fetched Signed VAA");
  } else if (isPending) {
    // SET VAA LOADING TRUE
    alert("VAA is Pending");
  } else {
    throw new Error("Error retrieving VAA info");
  }
}
