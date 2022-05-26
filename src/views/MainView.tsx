/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { ExternalLink as A } from "components/ExternalLink";
import { Header } from "components/Header";
import { FileListInput } from "containers/FileListInput";
import React from "react";
import { hasOpacity } from "styles/opacity";
import { GlobalTheme } from "styles/theme";

import { RenderDisplay } from "../containers/RenderDisplay";

const linkStyle = css`
  display: block;
  text-align: center;
  text-decoration: none;
  background: white;
  padding: 1rem 0rem;
  width: 100%;
  font-weight: 700;
  font-size: 2.3rem;
  cursor: pointer;
  ${hasOpacity(0.8)};
`;

const MasterContainer = styled.div`
  width: 1920px;
  height: 1100px;
  padding-top: 45px;
  font-family: "Lato", sans-serif;
  font-weight: 900;
  color: white;
`;

const GameFrame = styled.div`
  width: 1200px;
  height: 990px;
  border: 5px solid #09001e;
  margin-left: auto;
  margin-right: auto;
`;

const ReplayControlsContainer = styled.div`
  width: 850px;
  margin: 150px auto;
  padding-top: 25px;
  padding-bottom: 25px;
  background-color: #09001e40;
`;

const ControlsTitle = styled.div`
  font-family: "Lato", sans-serif;
  font-weight: 900;
  color: black;
  text-align: center;
  font-size: 25px;
`;

export const MainView: React.FC = () => {
  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <div className="hud-master-container">
        <div className="hud-game-frame">
          <div className="hud-replay-controls-container">
            <div className="hud-controls-title">Upload Replay Files</div>
            <FileListInput />
          </div>
        </div>
        <RenderDisplay />
      </div>
    </div>
  );
};
