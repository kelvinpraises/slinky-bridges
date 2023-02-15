import { Imprima } from "@next/font/google";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import styled from "styled-components";

import { kRadiusM } from "@/data/borderRadius";
import { useStateInfo } from "@/hooks/info";
import BridgeInputs from "./BridgeInputs";
import BridgeRoutes from "./BridgeRoutes";
import Button from "./Button";
import BridgeToken from "./BridgeToken";

const imprima = Imprima({
  style: "normal",
  weight: "400",
  subsets: ["latin"],
});

const BridgePanel = () => {
  const { isStateValid } = useStateInfo();

  return (
    <SBridgePanel>
      <SScrollAreaRoot>
        <SScrollAreaViewport>
          <SContent>
            <h2 style={{ fontFamily: imprima.style.fontFamily }}>
              Slinky Bridges
            </h2>
            <p style={{ marginBottom: "1rem" }}>
              A developmental bridge aggregator that transfers test tokens
              across chains.
            </p>
            <BridgeInputs />
            {isStateValid && <BridgeRoutes />}
            <BridgeToken />
          </SContent>
        </SScrollAreaViewport>
        <SScrollAreaScrollbar orientation="vertical">
          <SScrollAreaThumb />
        </SScrollAreaScrollbar>
        <SScrollAreaScrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </SScrollAreaScrollbar>
        <SScrollAreaCorner />
      </SScrollAreaRoot>
    </SBridgePanel>
  );
};

export default BridgePanel;

const SBridgePanel = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: grid;
  place-items: center;
  z-index: 2000;
`;

const SContent = styled.div`
  margin: 2rem;
`;

// Scroll Area

const SScrollAreaRoot = styled(ScrollArea.Root)`
  display: flex;
  flex-direction: column;
  width: auto;
  max-width: 40rem;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: ${kRadiusM};
  height: 33rem;

  position: fixed !important;
  overflow: hidden;
  --scrollbar-size: 10px;
`;

const SScrollAreaViewport = styled(ScrollArea.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

const SScrollAreaScrollbar = styled(ScrollArea.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  padding: 2px;
  background: #9c9c9ca6;
  transition: background 160ms ease-out;

  &:hover {
    background: #727272;
  }

  &[data-orientation="vertical"] {
    width: var(--scrollbar-size);
  }

  &[data-orientation="horizontal"] {
    flex-direction: column;
    height: var(--scrollbar-size);
  }
`;

const SScrollAreaThumb = styled(ScrollArea.Thumb)`
  flex: 1;
  background: #4a4a4a;
  border-radius: var(--scrollbar-size);
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`;

const SScrollAreaCorner = styled(ScrollArea.Corner)`
  background: #2c2c2c;
`;
