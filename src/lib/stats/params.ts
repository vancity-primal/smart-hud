import { get } from "lodash";

import { getPortColor } from "../portColor";
import { generateOutput } from "./compute";
import { filterGames } from "./filterGames";
import { GameDetails } from "./types";

const extractNameAndCode = (playerPort: number, details: GameDetails) => {
  const settings = details.settings;
  const metadata = details.metadata;
  const index = playerPort - 1;
  const player = settings.players.find((player) => player.playerIndex === index);
  const playerTag = player ? player.nametag : null;
  const netplayName: string | null = get(metadata, ["players", index, "names", "netplay"], null);
  const netplayCode: string | null = get(metadata, ["players", index, "names", "code"], null);
  const name = playerTag || netplayName || "";
  return [name, netplayCode || ""] as const;
};

export function generateStatParams(gameDetails: GameDetails[], statsList: string[]): Record<string, any> {
  const filtered = filterGames(gameDetails);
  if (!filtered || filtered.length === 0) {
    throw new Error("No valid games");
  }

  let stats;
  try {
    stats = generateOutput(statsList, filtered);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }

  const { games, summary } = stats;
  console.log("generated stats: ", stats);
  const params: Record<string, any> = {}; // "mckm1": , "mckm2", "mcno1", "mcno2", "opk1", "opk2", "tdd1", "tdd2", "dpo1", "dpo2", "ipm1", "ipm2", "akp1", "akp2", "nw1", "nw2"};

  // Set character info
  const lastGame = games[games.length - 1];
  const leftPlayer = lastGame.players[0];
  const rightPlayer = lastGame.players[1];
  params.leftColor = getPortColor(leftPlayer.port);
  params.rightColor = getPortColor(rightPlayer.port);
  params.leftPort = leftPlayer.port;
  params.rightPort = rightPlayer.port;

  params.char1 = leftPlayer.characterId;
  params.char2 = rightPlayer.characterId;
  params.color1 = leftPlayer.characterColor;
  params.color2 = rightPlayer.characterColor;

  // Set name tags
  const lastGameDetails = filtered[filtered.length - 1];
  const [leftTag, leftCode] = extractNameAndCode(leftPlayer.port, lastGameDetails);
  const [rightTag, rightCode] = extractNameAndCode(rightPlayer.port, lastGameDetails);
  params.name1 = leftTag.toUpperCase() || leftPlayer.characterName;
  params.name2 = rightTag.toUpperCase() || rightPlayer.characterName;
  params.sub1 = leftCode;
  params.sub2 = rightCode;

  // Set game info
  params.gt = games.length; // Set the total number of games

  games.forEach((game, i) => {
    // console.log("processing game: ", game);
    const gameKey = `g${i + 1}`;
    const stageId = game.stage.id as number;
    const gameDuration: string = game.duration;
    const playerInfo = game.players.map((p: any) => [p.characterId, p.characterColor, p.gameResult].join(","));
    const gameValue = [stageId, gameDuration, ...playerInfo].join(",");
    // console.log(`${gameKey} : ${gameValue}`);
    params[gameKey] = gameValue;
  });

  params.stats = statsList.join(",");
  // Set the stat values
  summary.forEach((s) => {
    // Stats can be null if the id is invalid or not specified
    if (!s) {
      return;
    }

    switch (s.id) {
      // Put any custom logic here
      default: {
        (s.results as any[]).forEach((result, i) => {
          params[`${s.id}${i + 1}`] = result.simple.text;
        });
        break;
      }
    }
  });

  console.log("returning these params: ", params);
  return params;
}
