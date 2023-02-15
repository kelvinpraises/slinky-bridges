import Image from "next/image";
import { styled } from "styled-components";

export const BgVariants = {};

const Background = () => {
  return (
    <SBackground>
      <Image
        src={"/paperlike.png"}
        alt={"bg"}
        style={{
          objectFit: "cover",
          zIndex: 0,
          objectPosition: "left",
          scale: 0.1,
        }}
        fill
        priority
      />
      <Image
        src={"/background.svg"}
        alt={"bg"}
        style={{
          objectFit: "cover",
          zIndex: 0,
          objectPosition: "center",
          scale: 0.1,
        }}
        fill
        priority
      />
    </SBackground>
  );
};

export default Background;

const SBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
