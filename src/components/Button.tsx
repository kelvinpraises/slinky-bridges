import { useRef } from "react";
import type { AriaButtonProps } from "react-aria";
import { useButton } from "react-aria";
import styled from "styled-components";

import { kRadiusL } from "@/data/borderRadius";

interface Button extends AriaButtonProps {
  className?: string;
}

const Button = (prop: Button) => {
  let ref = useRef(null);

  let { buttonProps } = useButton(prop, ref);

  return (
    <SButton disabled={prop.isDisabled} className={prop.className} ref={ref}>
      {prop.children}
    </SButton>
  );
};

export default Button;

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
    background-color: #000000;
    opacity: 0.7;
    cursor: default;
  }
`;
