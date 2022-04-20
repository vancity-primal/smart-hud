import _ from "lodash";

import { StatDefinition } from "../types";

export const averageTimeToKill: StatDefinition = {
  name: "Average Time to Kill",
  type: "number",
  betterDirection: "higher",
  recommendedRounding: 1,
  calculate(games, playerIndex) {
    const oppStocks = _.flatMap(games, (game) => {
      const stocks = _.get(game, ["stats", "stocks"]) || [];
      return _.filter(stocks, (stock) => {
        const isOpp = stock.playerIndex !== playerIndex;
        const hasEndPercent = stock.endPercent !== null;
        return isOpp && hasEndPercent;
      });
    });

    const result = {
      total: oppStocks.length,
      count: _.sumBy(oppStocks, "endFrame") - _.sumBy(oppStocks, "startFrame") || 0,
      ratio: null as number | null,
    };

    result.ratio = result.total ? result.count / result.total / 60 : null; //Convert to seconds.
    const simple = {
      number: result.ratio,
      text: result.ratio !== null ? result.ratio.toFixed(this.recommendedRounding) : "N/A",
    };

    return {
      result: result,
      simple: simple,
    };
  },
};
