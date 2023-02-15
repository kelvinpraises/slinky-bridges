import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createBridgeBlockSlice from "./createBridgeBlocksSlice";
import createBridgingDetailsSlice from "./createBridgingDetailsSlice";

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

type State = StateFromFunctions<[
  typeof createBridgeBlockSlice,
  typeof createBridgingDetailsSlice
]>;

export const useStore = create<State>()(
  devtools(
    (set, get, store) => ({
      ...createBridgeBlockSlice(set, get, store),
      ...createBridgingDetailsSlice(set, get, store),
    }),
    {  name: "slinky" }
  )
);
