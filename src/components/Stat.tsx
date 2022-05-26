/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";

export interface StatProps {
  label: string;
  color: string;
  leftPort: string;
  rightPort: string;
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
}

const StatLabel = styled.div`
  font-weight: 900;
  font-size: 24px;
`;

const StatContent = styled.div`
  font-weight: 900;
  font-size: 30px;
`;

const TextContent = styled(StatContent)`
  font-weight: 900;
  font-size: 30px;
`;

const OuterStat = styled.div`
  display: grid;
  grid-template-columns: 250px 690px 250px;
  width: 100%;
`;

const Stat: React.FC<StatProps & Record<string, any>> = (props) => {
  const {
    label,
    backgroundColor,
    color,
    leftPort,
    rightPort,
    leftComponent,
    rightComponent,
    children,
    ...rest
  } = props;
  return (
    <OuterStat>
      <div className={"hud-stats-box left-stats-box left-player-" + leftPort}>{leftComponent}</div>
      <StatLabel className="hud-title-bar">
        <p className="hud-title-text">{label}</p>
      </StatLabel>
      <div className={"hud-stats-box right-stats-box right-player-" + rightPort}>{rightComponent}</div>
    </OuterStat>
  );
};

Stat.defaultProps = {
  color: "black",
  backgroundColor: "white",
};

export const NumberStat: React.FC<StatProps> = (props) => {
  const { leftComponent, rightComponent, leftPort, rightPort, ...rest } = props;
  return (
    <Stat
      leftComponent={<div className="stats-box-text">{leftComponent}</div>}
      rightComponent={<div className="stats-box-text">{rightComponent}</div>}
      leftPort={leftPort}
      rightPort={rightPort}
      {...rest}
    />
  );
};

export const TextStat: React.FC<StatProps> = (props) => {
  const { leftComponent, rightComponent, leftPort, rightPort, ...rest } = props;
  return (
    <Stat
      leftComponent={<div className="stats-box-text">{leftComponent}</div>}
      rightComponent={<div className="stats-box-text">{rightComponent}</div>}
      leftPort={leftPort}
      rightPort={rightPort}
      {...rest}
    />
  );
};
