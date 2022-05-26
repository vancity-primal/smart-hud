/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { reorder } from "lib/util";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Theme } from "styles/theme";

import { Divider } from "./Divider";
import { StatDisplayItem } from "./StatDisplayItem";
import { Statistic } from "./Statistic";

interface StatDisplayListProps {
  stats: string;
  setStats: (s: string) => void;
  leftPort: string;
  rightPort: string;
}

export const StatDisplayList: React.FC<StatDisplayListProps> = (props) => {
  const { stats, setStats, leftPort, rightPort } = props;
  const [items, setItems] = React.useState<string[]>(stats.split(","));
  React.useEffect(() => {
    setItems(stats.split(","));
  }, [stats]);

  return (
    <div className="hud-container" css={css``}>
      <div id="welcome-message">
        <p
          css={css`
            font-family: "Lato", sans-serif;
            font-weight: 900;
            color: white;
            text-align: center;
            font-size: 25px;
            margin-top: 6px;
          `}
        >
          Welcome from Vancouver, BC!
        </p>
      </div>
      <div
        id="smarthud-logo"
        css={css`
          display: none;
        `}
      >
        <img
          css={css`
            margin-top: 6px;
            max-height: 34px;
          `}
          src="SMART-HUD-LOGO.svg"
          alt="smartHUD"
        />
      </div>
      {items.map((item, index) => {
        return (
          <StatDisplayItem
            hasItem={Boolean(item)}
            key={index}
            css={css`
              display: none;
            `}
          >
            <Statistic statId={item} leftPort={leftPort} rightPort={rightPort} />
          </StatDisplayItem>
        );
      })}
    </div>
  );
};
