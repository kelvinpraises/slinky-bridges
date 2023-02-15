import bridges from "@/bridges";
import { IRoutes } from "@/components/BridgeRoutes";
import { BridgeType } from "@/data/config";
import { useStore } from "@/store/useStore";
import produce from "immer";
import { useMemo } from "react";

export function useBridgeRoute() {
  const originNetworkType = useStore((state) => state.originNetworkType);
  const targetNetworkType = useStore((state) => state.targetNetworkType);
  const originTokenType = useStore((state) => state.originTokenType);
  const targetTokenType = useStore((state) => state.targetTokenType);
  const setBridgeType = useStore((state) => state.setBridgeType);

  const selectBridgeType = useMemo(() => {
    if (!originNetworkType || !targetNetworkType || !originTokenType) return [];

    const bridgeType = new Set<BridgeType>();

    bridges.forEach((bridge) => {
      bridge.networks[originNetworkType]?.tokens[
        originTokenType
      ]?.targetNetworks.forEach((x) => {
        if (x.network === targetNetworkType && x.token === targetTokenType) {
          bridgeType.add(bridge.name);
        }
      });
    });

    bridges.forEach((bridge) => {
      for (const [token, value] of Object.entries(
        bridge.networks[targetNetworkType]?.tokens || {}
      )) {
        value.targetNetworks.forEach((x) => {
          if (x.network === originNetworkType && x.token === originTokenType) {
            bridgeType.add(bridge.name);
          }
        });
      }
    });

    const sortedBridgeType = produce(Array.from(bridgeType), (draft) => {
      draft.sort();
    });

    return sortedBridgeType.map((bridge, i) => {
      // Selects the first bridge as the path to take to the target network.
      if (i === 0) {
        setBridgeType(bridge);
      }

      type IBridgeDetails = {
        [key in BridgeType]: IRoutes;
      };

      const bridgeDetails: IBridgeDetails = {
        [BridgeType.WORMHOLE]: {
          title: BridgeType.WORMHOLE,
          redeem: false,
          icon: "/icons/wormhole.svg",
          time: "10 mins",
        },

        [BridgeType.GLITTER_BRIDGE]: {
          title: BridgeType.GLITTER_BRIDGE,
          redeem: false,
          icon: "",
          time: "10 mins",
        },
      };

      return bridgeDetails[bridge];
    });
  }, [originTokenType, originNetworkType, targetTokenType, targetNetworkType]);

  return { selectBridgeType };
}
