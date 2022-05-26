/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useParam } from "lib/hooks";
import { PortColor } from "lib/portColor";
import React from "react";

import { StatDisplayList } from "./StatDisplay/StatDisplayList";

const NameBlockContainer = styled.div<{
  align: "left" | "right";
}>`
  ${(p) => `
  width: 20%;
  position: absolute;
  ${p.align}: 0;
  margin-${p.align}: 2rem;
  bottom: 15%;
  `}
`;

export const RenderDisplay: React.FC = () => {
  const [leftPort] = useParam("leftPort");
  const [rightPort] = useParam("rightPort");
  const [stats, setStats] = useParam("stats");

  return <StatDisplayList stats={stats} setStats={setStats} leftPort={leftPort} rightPort={rightPort} />;
};
