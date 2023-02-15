import { useCallback } from "react";
import { Swap } from "react-iconly";
import { Item } from "react-stately";
import { styled } from "styled-components";

import { BridgeBlockType, NetworkType, TokenType } from "@/data/config";
import { useGraphNetworks, useGraphTokens } from "@/hooks/bridgeInput";
import { useStore } from "@/store/useStore";
import Connect from "./Connect";
import { Label } from "./ListBox";
import { Select } from "./Select";
import TokenField from "./TokenField";

const BridgeInputs = () => {
  const originNetworkType = useStore((state) => state.originNetworkType);
  const targetNetworkType = useStore((state) => state.targetNetworkType);
  const targetTokenType = useStore((state) => state.targetTokenType);
  const originTokenAmount = useStore((state) => state.originTokenAmount);
  const setOriginNetworkType = useStore((state) => state.setOriginNetworkType);
  const setTargetNetworkType = useStore((state) => state.setTargetNetworkType);
  const setOriginTokenType = useStore((state) => state.setOriginTokenType);
  const setTargetTokenType = useStore((state) => state.setTargetTokenType);
  const setOriginTokenAmount = useStore((state) => state.setOriginTokenAmount);
  const swapNetwork = useStore((state) => state.swapNetwork);

  const { originNetworks, targetNetworks } = useGraphNetworks();
  const { originToken, targetToken } = useGraphTokens();

  const swapBlockInfo = useCallback(() => {
    swapNetwork();
  }, []);

  const switchNetwork = useCallback(
    (key: NetworkType, block: BridgeBlockType) => {
      if (block === BridgeBlockType.ORIGIN) {
        setOriginNetworkType(key);
      }
      if (block === BridgeBlockType.TARGET) {
        setTargetNetworkType(key);
      }
    },
    []
  );


  return (
    <SBridgeInputs>
      <OriginBlock>
        <Select
          label={`From This Network`}
          items={originNetworks}
          selectedKey={originNetworkType}
          onSelectionChange={(key) =>
            switchNetwork(key as NetworkType, BridgeBlockType.ORIGIN)
          }
        >
          {(item) => (
            <Item textValue={item.name}>
              <Avatar src={item.logo} alt={item.name} />
              <div>
                <Label>{item.name}</Label>
              </div>
            </Item>
          )}
        </Select>

        <Connect
          networkType={originNetworkType}
          bridgeBlockType={BridgeBlockType.ORIGIN}
        />

        <Select
          label={"Send"}
          items={originToken}
          selectedKey={undefined}
          onSelectionChange={(key) => setOriginTokenType(key as TokenType)}
        >
          {(item) => (
            <Item textValue={item.name}>
              <Avatar src={item.logo} alt={item.name} />
              <div>
                <Label>{item.name}</Label>
              </div>
            </Item>
          )}
        </Select>

        <TokenField
          label="Amount To Send"
          value={Number(originTokenAmount)}
          onChange={setOriginTokenAmount}
          disabled={false}
        />
      </OriginBlock>

      <div onClick={() => swapBlockInfo()}>
        <SToggle set="light" />
      </div>

      <TargetBlock>
        <Select
          label={`To This Network`}
          items={targetNetworks}
          selectedKey={targetNetworkType}
          onSelectionChange={(key) =>
            switchNetwork(key as NetworkType, BridgeBlockType.TARGET)
          }
        >
          {(item) => (
            <Item textValue={item.name}>
              <Avatar src={item.logo} alt={item.name} />
              <div>
                <Label>{item.name}</Label>
              </div>
            </Item>
          )}
        </Select>

        <Connect
          networkType={targetNetworkType}
          bridgeBlockType={BridgeBlockType.TARGET}
        />

        <Select
          label={"Receive"}
          items={targetToken}
          selectedKey={targetTokenType}
          onSelectionChange={(key) => setTargetTokenType(key as TokenType)}
        >
          {(item) => (
            <Item textValue={item.name}>
              <Avatar src={item.logo} alt={item.name} />
              <div>
                <Label>{item.name}</Label>
              </div>
            </Item>
          )}
        </Select>

        <TokenField
          label="Received Amount"
          value={Number(originTokenAmount)}
          onChange={setOriginTokenAmount}
          disabled={true}
        />
      </TargetBlock>
    </SBridgeInputs>
  );
};

export default BridgeInputs;

const SToggle = styled(Swap)``;

const SBridgeInputs = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OriginBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-width: max-content;
`;

const TargetBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  background: #000000;
`;
