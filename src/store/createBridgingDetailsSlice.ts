import { BridgeType } from "@/data/config";
import { immer } from "zustand/middleware/immer";

type State = {
  bridgeType: BridgeType | null;
};

type Actions = {
  setBridgeType: (bridge: BridgeType) => void;
};

export default immer<State & Actions>((set) => ({
  bridgeType: null,

  setBridgeType: (bridge) =>
    set((state) => {
      state.bridgeType = bridge;
    }),
}));
