/** @jsx jsx */
import { css, Global, jsx } from "@emotion/core";

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
}

export const defaultTheme: Theme = {
  primaryColor: "#286163",
  secondaryColor: "#121020",
};

export const GlobalTheme: React.FC = () => {
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}
    />
  );
};
