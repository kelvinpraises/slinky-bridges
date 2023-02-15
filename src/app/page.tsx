"use client";

import { styled } from "styled-components";

import BridgePanel from "@/components/BridgePanel";

export default function Home() {
  return (
    <SMain>
      <BridgePanel />
    </SMain>
  );
}

const SMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
