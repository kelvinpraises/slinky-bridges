import type { AriaSelectProps } from "@react-types/select";
import * as React from "react";
import { HiddenSelect, useButton, useSelect } from "react-aria";
import { ChevronDown } from "react-iconly";
import { useSelectState } from "react-stately";
import styled from "styled-components";

import { kRadiusL } from "@/data/borderRadius";
import { ListBox } from "./ListBox";
import { Popover } from "./Popover";
import { Label, Wrapper } from "./shared";

export { Item } from "react-stately";

interface ButtonProps {
  $isOpen?: boolean;
  isFocusVisible?: boolean;
}

export function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  let state = useSelectState(props);

  // Get props for child elements from useSelect
  let ref = React.useRef(null);
  let { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  let { buttonProps } = useButton(triggerProps, ref);

  return (
    <Wrapper>
      <Label {...labelProps}>{props.label}</Label>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <Button {...buttonProps} ref={ref} $isOpen={state.isOpen}>
        <Value {...valueProps}>
          {state.selectedItem ? (
            state.selectedItem.rendered
          ) : (
            <Placeholder>
              <AvatarPlaceholder />
              <p style={{ color: "#535353" }}>Select a network</p>
            </Placeholder>
          )}
        </Value>

        <SChevronDown set="light" />
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </Wrapper>
  );
}

const Button = styled.button<ButtonProps>`
  appearance: none;
  background: ${(props) => (props.$isOpen ? "#eee" : "white")};
  border: 1px solid;
  padding: 8px 9px;
  margin-top: 3px;
  outline: none;
  border-color: "lightgray";
  box-shadow: "0 0 0 3px rgba(143, 188, 143, 0.5)";
  border-radius: ${kRadiusL};
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 15rem;
  height: 3rem;
  text-align: left;
  font-size: 1rem;
  color: black;

  &:focus {
    border-color: #eb006c;
    box-shadow: 0 0 0 3px #bc8f9c7f;
  }
`;

const Value = styled.span`
  display: inline-flex;
  align-items: center;
`;

const SChevronDown = styled(ChevronDown)`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: black;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AvatarPlaceholder = styled.div`
  background: #d3d3d3;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
`;
