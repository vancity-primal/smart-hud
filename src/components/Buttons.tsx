/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { hasOpacity } from "styles/opacity";

export const ControlsButton = styled.button`
  width: 250px;
  background-color: green;
  padding: 10px;
  margin: auto;
  &:hover:enabled {
    background-color: darkgreen;
  }
  &:active:enabled {
    background-color: lightgreen;
  }
`;

export const ResetButton = styled.button`
  width: 250px;
  background-color: grey;
  padding: 10px;
  margin: auto;
  &:hover:enabled {
    background-color: darkgrey;
  }
  &:active:enabled {
    background-color: lightgrey;
  }
`;

export const SecondaryButton: React.FC<Record<string, any>> = (props) => {
  const { align, children, ...rest } = props;
  const alignment = align || "center";
  return (
    <div
      css={css`
        user-select: none;
        text-align: ${alignment};
      `}
    >
      <span
        css={css`
          display: inline-block;
          font-size: 1.4rem;
          cursor: pointer;
          margin: 0.5rem 0;
          padding: 0 0.5rem;
          ${hasOpacity(0.5)}
          &:hover {
            text-decoration: underline;
          }
        `}
        {...rest}
      >
        {children}
      </span>
    </div>
  );
};
