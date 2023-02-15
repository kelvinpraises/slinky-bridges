import { NetworkType, TokenType } from "@/data/config";
import { immer } from "zustand/middleware/immer";

type State = {
  originNetworkType: NetworkType | null;
  originTokenType: TokenType | null;
  originTokenAmount: string;

  targetNetworkType: NetworkType | null;
  targetTokenType: TokenType | null;
  targetTokenAmount: string;
};

type Actions = {
  setOriginNetworkType: (ntw: NetworkType) => void;
  setOriginTokenType: (tkn: TokenType) => void;
  setOriginTokenAmount: (amt: number) => void;

  setTargetNetworkType: (ntw: NetworkType) => void;
  setTargetTokenType: (tkn: TokenType) => void;
  setTargetTokenAmount: (amt: number) => void;

  resetState: () => void;
  swapNetwork: () => void;
};

export default immer<State & Actions>((set, get) => ({
  originNetworkType: NetworkType.ALGORAND,
  originTokenType: null,
  originTokenAmount: "",

  setOriginNetworkType: (ntw) =>
    set((state) => {
      state.originNetworkType = ntw;
    }),
  setOriginTokenType: (tkn) =>
    set((state) => {
      state.originTokenType = tkn;
    }),
  setOriginTokenAmount: (amt) =>
    set((state) => {
      state.originTokenAmount = amt + "";
    }),

  targetNetworkType: null,
  targetTokenType: null,
  targetTokenAmount: "",

  setTargetNetworkType: (ntw) =>
    set((state) => {
      state.targetNetworkType = ntw;
    }),
  setTargetTokenType: (tkn) =>
    set((state) => {
      state.targetTokenType = tkn;
    }),
  setTargetTokenAmount: (amt) =>
    set((state) => {
      state.targetTokenAmount = amt + "";
    }),

  resetState: () =>
    set((state) => {
      state.originNetworkType = null;
      state.originTokenType = null;
      state.originTokenAmount = "";

      state.targetNetworkType = null;
      state.targetTokenType = null;
      state.targetTokenAmount = "";
    }),
  swapNetwork: () =>
    set((state) => {
      state.originNetworkType = get().targetNetworkType;
      state.originTokenType = null;
      state.originTokenAmount = "";

      state.targetNetworkType = get().originNetworkType;
      state.targetTokenType = null;
      state.targetTokenAmount = "";
    }),
}));
