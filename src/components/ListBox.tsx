import { Node } from "@react-types/shared";
import * as React from "react";
import type { AriaListBoxOptions } from "react-aria";
import { useListBox, useOption } from "react-aria";
import type { ListState } from "react-stately";
import styled from "styled-components";

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

interface ListItemProps {
  $isFocused?: boolean;
  $isSelected?: boolean;
}

export function ListBox(props: ListBoxProps) {
  let ref = React.useRef<HTMLUListElement>(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <SList {...listBoxProps} ref={listBoxRef}>
      {Array.from(state.collection).map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </SList>
  );
}

const SList = styled.ul`
  max-height: 150px;
  overflow: auto;
  list-style: none;
  padding: 0;
  margin: 4px 0;
  outline: none;
  width: 100%;
`;

interface OptionContextValue {
  labelProps: React.HTMLAttributes<HTMLElement>;
  descriptionProps: React.HTMLAttributes<HTMLElement>;
}

const OptionContext = React.createContext<OptionContextValue>({
  labelProps: {},
  descriptionProps: {},
});

function Option({ item, state }: OptionProps) {
  let ref = React.useRef<HTMLLIElement>(null);
  let { optionProps, labelProps, descriptionProps, isSelected, isFocused } =
    useOption(
      {
        key: item.key,
      },
      state,
      ref
    );

  return (
    <SListItem
      {...optionProps}
      ref={ref}
      $isFocused={isFocused}
      $isSelected={isSelected}
    >
      <SItemContent>
        <OptionContext.Provider value={{ labelProps, descriptionProps }}>
          {item.rendered}
        </OptionContext.Provider>
      </SItemContent>
    </SListItem>
  );
}

const SListItem = styled.li<ListItemProps>`
  background: ${(props) => (props.$isFocused ? "#f42282" : "")};
  color: ${(props) =>
    props.$isFocused ? "white" : props.$isSelected ? "#f42282" : "#333"};
  font-size: 14px;
  font-weight: ${(props) => (props.$isSelected ? "600" : "normal")};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  outline: none;
`;

const SItemContent = styled.div`
  display: flex;
  align-items: center;
`;

// The Label and Description components will be used within an <Item>.
// They receive props from the OptionContext defined above.
// This ensures that the option is ARIA labelled by the label, and
// described by the description, which makes for better announcements
// for screen reader users.

export function Label({ children }: { children: React.ReactNode }) {
  let { labelProps } = React.useContext(OptionContext);
  return <div {...labelProps}>{children}</div>;
}

const StyledDescription = styled.div`
  font-weight: normal;
  font-size: 12px;
`;

export function Description({ children }: { children: React.ReactNode }) {
  let { descriptionProps } = React.useContext(OptionContext);
  return (
    <StyledDescription {...descriptionProps}>{children}</StyledDescription>
  );
}
