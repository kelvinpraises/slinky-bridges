import * as React from "react";
import type { AriaPopoverProps} from "react-aria";
import { DismissButton, Overlay, usePopover } from "react-aria";
import type { OverlayTriggerState } from "react-stately";
import styled from "styled-components";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  popoverRef?: React.RefObject<HTMLDivElement>;
}

const Wrapper = styled.div`
  position: absolute;
  top: 100%;
  z-index: 1;
  width: 15rem;
  border: 1px solid lightgray;
  border-radius: 4px;
  margin-top: 6px;
  box-shadow: 0 4px 8px #eee;
  background: white;
`;

export function Popover(props: PopoverProps) {
  let ref = React.useRef<HTMLDivElement>(null);
  let { popoverRef = ref, state, children, isNonModal } = props;

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef,
    },
    state
  );

  return (
    <Overlay>
      {!isNonModal && (
        <div {...underlayProps} style={{ position: "fixed", inset: 0 }} />
      )}
      <Wrapper {...popoverProps} ref={popoverRef}>
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </Wrapper>
    </Overlay>
  );
}
