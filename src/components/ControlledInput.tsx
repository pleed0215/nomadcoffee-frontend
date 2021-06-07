import React, { InputHTMLAttributes } from "react";
import {
  Controller,
  FieldValues,
  Path,
  UseControllerProps,
  FieldPath,
} from "react-hook-form";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const ErrorMsg = styled.span`
  color: red;
  font-style: italic;
  font-size: 12px;
  margin-top: 4px;
`;

type ControlledInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value"> &
  UseControllerProps<TFieldValues, TName> & { label?: string };

const Input = styled.input<{ isError?: boolean }>`
  border: 1px solid
    ${(props) => (props.isError === true ? "red" : props.theme.color.border)};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.primary};
  border-radius: 4px;
  width: 100%;
  padding: 0.5rem;
  outline: none;
`;

const Label = styled.label`
  font-size: 1rem;
  color: ${(props) => props.theme.color.primary};
  margin-bottom: 4px;
`;

type ControlledInputFuncType = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>(
  props: ControlledInputProps<TFieldValues, TName>
) => JSX.Element;

export const ControlledInput: ControlledInputFuncType = ({
  control,
  name,
  defaultValue,
  rules,
  label,
  ...rest
}) => (
  <Controller
    control={control}
    render={({ field, formState, fieldState }) => (
      <InputWrapper>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Input
          onBlur={field.onBlur}
          onChange={field.onChange}
          value={field.value as string | number}
          ref={field.ref}
          isError={Boolean(fieldState.error)}
          {...rest}
        />
        {fieldState.error && <ErrorMsg>{fieldState.error.message}</ErrorMsg>}
      </InputWrapper>
    )}
    rules={rules}
    name={name}
    defaultValue={defaultValue}
  />
);
