/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { characters as characterUtil, stages as stageUtil } from "@slippi/slippi-js";
import { ErrorMessage } from "components/ErrorMessage";
import { getCharacterStockIcon } from "lib/resources";
import { convertFrameCountToDurationString } from "lib/util";
import { findWinner } from "lib/winner";
import React from "react";
import { ProcessedFile } from "store/types";
import { hasOpacity } from "styles/opacity";
import { defaultTheme } from "styles/theme";

const BasicFileItem: React.FC<{ name: string; onRemove?: () => void }> = (props) => {
  const { onRemove, name, children } = props;
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 700px;
        height: 85px;
        background-color: gray;
        margin: 15px auto;
        &:hover {
          .remove-button {
            opacity: 1;
          }
        }
        .remove-button {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          background: white;
          color: ${defaultTheme.secondaryColor};
          border: none;
          font-weight: bold;
          font-size: 2.5rem;
          cursor: pointer;
          padding: 0.2rem 1rem;
          margin: 0;
        }
      `}
    >
      <div
        css={css`
          flex: 1;
          padding: 0rem 0 0 0rem;
        `}
      >
        <div
          css={css`
            padding: 0.5rem 0 0 2rem;
            font-size: 1.6rem;
            font-weight: bold;
            margin-bottom: 1rem;
            font-family: monospace;
          `}
        >
          {name}
        </div>
        <div
          css={css`
            padding: 0 0 0 10rem;
          `}
        >
          {children}
        </div>
      </div>
      {onRemove && (
        <button className="remove-button" onClick={onRemove} title="Remove">
          ✕
        </button>
      )}
    </div>
  );
};

const CharacterIcon: React.FC<{
  charId: string | number;
  color: string;
  winner?: boolean;
}> = ({ charId, color, winner }) => {
  const src = getCharacterStockIcon(charId, color);
  return (
    <div
      css={css`
        position: relative;
        display: inline-block;
        margin-top: 0.5rem;
        ${winner &&
        `&::after {
          position: absolute;
          content: " ";
          height: 0.7rem;
          width: 60%;
          background-color: #ffa700;
          left: 20%;
          bottom: 110%;
          clip-path: polygon(50% 0%, 75% 35%, 100% 0, 100% 100%, 0 100%, 0 0, 25% 35%);
        }
      `}
      `}
    >
      <img src={src} style={{ height: "3rem" }} alt="stock icon" />
    </div>
  );
};

export interface FileItemProps {
  file: ProcessedFile;
  onRemove: () => void;
}

export const FileItem: React.FC<FileItemProps> = (props) => {
  const { file, onRemove } = props;
  const { filename, loading, error, details } = file;
  if (loading) {
    return (
      <BasicFileItem name={filename}>
        <span
          css={css`
            font-weight: bold;
          `}
        >
          LOADING...
        </span>
      </BasicFileItem>
    );
  }
  if (error || !details) {
    return (
      <BasicFileItem onRemove={onRemove} name={filename}>
        <ErrorMessage>{error.message}</ErrorMessage>
      </BasicFileItem>
    );
  }

  const stageName = stageUtil.getStageName(details.settings.stageId as number);
  const players = details.settings.players;
  const duration = details.latestFrame ? convertFrameCountToDurationString(details.latestFrame.frame) : "N/A";
  const winnerIndex = details.latestFrame ? findWinner(details.latestFrame) : null;
  const icons = players.map((player) => {
    const winner = player.playerIndex === winnerIndex;
    const charId = player.characterId as number;
    const color = characterUtil.getCharacterColorName(charId, player.characterColor as number);
    return <CharacterIcon key={`${player.port}-icon`} charId={charId} color={color} winner={winner} />;
  });
  return (
    <BasicFileItem onRemove={onRemove} name={filename}>
      <div
        css={css`
          display: grid;
          justify-items: center;
          align-items: center;
          grid-template-columns: repeat(3, 1fr);
          font-weight: bold;
        `}
      >
        <div>{stageName}</div>
        <div
          css={css`
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 1rem;
          `}
        >
          {icons}
        </div>
        <div>{duration}</div>
      </div>
    </BasicFileItem>
  );
};
