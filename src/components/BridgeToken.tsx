import { kRadiusL } from "@/data/borderRadius";
import { BridgeType } from "@/data/config";
import { useStateInfo, useWalletConnectionInfo } from "@/hooks/info";
import { useWormHoleBridge } from "@/hooks/wormholeBridge";
import { useStore } from "@/store/useStore";
import { useCallback } from "react";
import styled from "styled-components";
import Button from "./Button";

const BridgeTokenButton = () => {
  const bridgeType = useStore((state) => state.bridgeType);
  const { isStateValid } = useStateInfo();
  const { areWalletsConnected } = useWalletConnectionInfo();
  const { bridgeToken } = useWormHoleBridge();

  const handleGlitterBridge = useCallback(() => {
    if (!areWalletsConnected) return alert("please connect wallets first");
  }, [areWalletsConnected]);

  const handleWormhole = useCallback(async () => {
    if (!areWalletsConnected) return alert("please connect wallets first");
    await bridgeToken();
  }, [areWalletsConnected, bridgeToken]);

  if (BridgeType.GLITTER_BRIDGE === bridgeType && isStateValid) {
    return (
      <SContent>
        <SButton onClick={handleGlitterBridge}>BRIDGE TOKEN</SButton>
      </SContent>
    );
  }

  // if (BridgeType.WORMHOLE === bridgeType && isStateValid) {
    return (
      <SContent>
        <SButton onClick={async () => await handleWormhole()}>
          BRIDGE TOKEN
        </SButton>
      </SContent>
    );
  // }

  // return (
  //   <SContent>
  //     <SDisabledButton isDisabled={true}>BRIDGE TOKEN</SDisabledButton>
  //   </SContent>
  // );
};

export default BridgeTokenButton;

const SContent = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
`;

const SDisabledButton = styled(Button)`
  flex: 1;
`;
const SButton = styled.button`
  all: unset;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: ${kRadiusL};
  color: #ffffff;
  height: 2rem;
  font-weight: 600;
  line-height: 20px;
  font-size: 0.9rem;
  text-align: center;
  transition: all 200ms ease;
  padding: 10px 22px;
  user-select: none;
  background-color: #eb006c;
  margin-bottom: 1rem;
  width: 100%;

  &:focus {
    border-color: #eb006c;
    box-shadow: 0 0 0 3px #bc8f9c7f;
  }

  &:hover {
    background-color: #f42282;
  }

  &:active {
    background-color: #c6005b;
  }

  &:disabled {
    background-color: #eb006c;
    opacity: 0.7;
    cursor: default;
  }
`;
