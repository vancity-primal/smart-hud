import { ComboType } from "@slippi/slippi-js";
import { exists } from "lib/exists";
import _ from "lodash";

import { StatDefinition } from "../types";

export const highDamageCombos: StatDefinition = {
  name: "Highest Damage Combo",
  type: "number",
  betterDirection: "higher",
  recommendedRounding: 1,
  calculate(games, playerIndex) {
    const combos = _.flatMap(games, (game) => {
      const combosPerGame = _.get(game, ["stats", "combos"]) || [];
      return _.filter(combosPerGame, (combo) => {
        const isForPlayer = combo.playerIndex !== playerIndex;
        const hasEndPercent = combo.endPercent !== null;
        return isForPlayer && hasEndPercent;
      });
    });

    const getDamageDone = (combo: ComboType) => {
      if (exists(combo.endPercent)) {
        return combo.endPercent - combo.startPercent;
      }
      return 0;
    };

    const orderedCombos = _.orderBy(combos, [getDamageDone], "desc");
    const topCombo = _.first(orderedCombos);
    const simple = {
      text: "N/A",
      number: null as number | null,
    };

    if (topCombo) {
      simple.number = getDamageDone(topCombo);
      simple.text = simple.number.toFixed(this.recommendedRounding);
    }

    return {
      result: _.take(orderedCombos, 5),
      simple: simple,
    };
  },
};
