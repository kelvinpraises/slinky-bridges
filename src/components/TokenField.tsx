import { kRadiusL } from "@/data/borderRadius";
import { useRef } from "react";
import { AriaNumberFieldProps, useLocale, useNumberField } from "react-aria";
import { useNumberFieldState } from "react-stately";
import styled from "styled-components";
import { Wrapper, Label } from "./shared";

interface ITokenField extends AriaNumberFieldProps {
  onChange: any;
  disabled: boolean;
}

const TokenField = (props: ITokenField) => {
  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = useRef(null);
  let { labelProps, groupProps, inputProps } = useNumberField(
    props,
    state,
    inputRef
  );

  return (
    <Wrapper>
      <Label {...labelProps}>{props.label}</Label>
      <SInput {...inputProps} ref={inputRef} />
    </Wrapper>
  );
};

export default TokenField;

const SInput = styled.input`
  appearance: none;
  border: 1px solid;
  padding: 8px 16px;
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
