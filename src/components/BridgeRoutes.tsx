import { kRadiusM } from "@/data/borderRadius";
import { BridgeType } from "@/data/config";
import { useBridgeRoute } from "@/hooks/bridgeRoute";
import { useStore } from "@/store/useStore";
import styled from "styled-components";
import { Label } from "./shared";

const BridgeRoutes = () => {
  const { selectBridgeType } = useBridgeRoute();
  return (
    <SBridgeRoutes>
      <Label>Routes</Label>

      {selectBridgeType.map((b, i) => (
        <Routes key={i} {...b} />
      ))}
    </SBridgeRoutes>
  );
};

export default BridgeRoutes;

export interface IRoutes {
  title: BridgeType;
  redeem: boolean;
  icon: string;
  time: string;
}

const Routes = ({ title, redeem, icon, time }: IRoutes) => {
  const bridgeType = useStore((state) => state.bridgeType);
  const setBridgeType = useStore((state) => state.setBridgeType);

  return (
    <SRoute
      $selected={bridgeType === title}
      onClick={() => {
        setBridgeType(title);
      }}
    >
      <SFlexWrap>
        <Avatar src={icon} />
        <Title>{title}</Title>
      </SFlexWrap>

      <SColFlexWrap>
        <Title2>{time}</Title2>
        <Title3>Est. Time</Title3>
      </SColFlexWrap>

      <SColFlexWrap>
        {redeem ? <Title2>Available</Title2> : <Title2>Unavailable</Title2>}
        <Title3>Auto Redeem on Target Chain</Title3>
      </SColFlexWrap>
    </SRoute>
  );
};

const SBridgeRoutes = styled.div`
  margin-bottom: 1rem;
`;

const SRoute = styled.div<{ $selected: boolean }>`
  display: flex;
  background: linear-gradient(90deg, #0e101b 0%, #36383f 100%);
  border: ${({ $selected }) =>
    $selected ? "3px solid #FF2929" : "3px solid #50546c"};
  border-radius: ${kRadiusM};
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
`;

const Avatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 8px;
  background: #000000;
`;

const SFlexWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SColFlexWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 20px;
  color: white;
`;

const Title2 = styled.p`
  font-weight: 700;
  font-size: 16px;
  color: white;
`;

const Title3 = styled.p`
  font-weight: 400;
  font-size: 12px;
  color: white;
`;
