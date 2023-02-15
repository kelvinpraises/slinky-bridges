import bridges from "@/bridges";
import { networkDetails, tokenDetails, TokenType } from "@/data/config";
import { useStore } from "@/store/useStore";
import produce from "immer";
import { useMemo } from "react";

export function useGraphNetworks() {
  const originNetworkType = useStore((state) => state.originNetworkType);

  const originNetworks = useMemo(() => {
    return Object.entries(networkDetails).map((x) => x[1]);
  }, []);

  const targetNetworks = useMemo(() => {
    const networkArray = Object.entries(networkDetails).map((x) => x[1]);

    return produce(networkArray, (draft) => {
      const index = draft.findIndex((todo) => todo.id === originNetworkType);
      if (index !== -1) draft.splice(index, 1);
    });
  }, [originNetworkType]);

  return { originNetworks, targetNetworks };
}

export function useGraphTokens() {
  const originNetworkType = useStore((state) => state.originNetworkType);
  const targetNetworkType = useStore((state) => state.targetNetworkType);
  const originTokenType = useStore((state) => state.originTokenType);
  const setTargetTokenType = useStore((state) => state.setTargetTokenType);

  const originToken = useMemo(() => {
    if (!originNetworkType || !targetNetworkType) return [];

    let tokens = new Set<string>();

    // Get tokens to bridge if origin network supports target network
    bridges.forEach((bridge) => {
      for (const [token, value] of Object.entries(
        bridge.networks[originNetworkType]?.tokens || {}
      )) {
        value.targetNetworks.forEach((x) => {
          if (x.network === targetNetworkType) {
            tokens.add(token);
          }
        });
      }
    });

    // Bridge back token to origin network as target network
    // MISNOMER: being an origin network or target network depends on the token movement and not placement in BridgeBlockType
    bridges.forEach((bridge) => {
      for (const [_, value] of Object.entries(
        bridge.networks[targetNetworkType]?.tokens || {}
      )) {
        value.targetNetworks.forEach((x) => {
          if (x.network === originNetworkType) {
            tokens.add(x.token);
          }
        });
      }
    });

    const sortedTokens = produce(Array.from(tokens), (draft) => {
      draft.sort();
    });

    return sortedTokens.map((token) => tokenDetails[token as TokenType]);
  }, [originNetworkType, targetNetworkType]);

  const targetToken = useMemo(() => {
    if (!originNetworkType || !targetNetworkType || !originTokenType) return [];

    const tokens = new Set<TokenType>();

    bridges.forEach((bridge) => {
      bridge.networks[originNetworkType]?.tokens[
        originTokenType
      ]?.targetNetworks.forEach((x) => {
        if (x.network === targetNetworkType) {
          tokens.add(x.token);
        }
      });
    });

    bridges.forEach((bridge) => {
      for (const [token, value] of Object.entries(
        bridge.networks[targetNetworkType]?.tokens || {}
      )) {
        value.targetNetworks.forEach((x) => {
          if (x.network === originNetworkType && x.token === originTokenType) {
            tokens.add(token as TokenType);
          }
        });
      }
    });

    const sortedTokens = produce(Array.from(tokens), (draft) => {
      draft.sort();
    });

    return sortedTokens.map((token, i) => {
      const tokens = tokenDetails[token as TokenType];
      // Init the target token select component with the first matching token
      if (i === 0) {
        setTargetTokenType(tokens.id);
      }
      return tokens;
    });
  }, [originTokenType, originNetworkType, targetNetworkType]);

  return { originToken, targetToken };
}
