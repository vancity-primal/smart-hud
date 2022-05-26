/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ControlsButton, ResetButton } from "components/Buttons";
import { DropPad } from "components/DropPad";
import { ErrorMessage } from "components/ErrorMessage";
import { FileList } from "components/FileList";
import { readFileAsGameDetails } from "lib/readFile";
import { generateSearchParams } from "lib/searchParams";
import { generateStatParams } from "lib/stats";
import { GameDetails, Stat } from "lib/stats/types";
import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AppContext, Types } from "../store";
import { StatOption, StatOptions } from "./StatOptions";

let timer: any = null;

const STAT_OPTIONS_STORE_KEY = "statOptions";

const ALL_STATS: string[] = [
  Stat.INPUTS_PER_MINUTE,
  Stat.DAMAGE_PER_OPENING,
  Stat.OPENINGS_PER_KILL,
  Stat.DAMAGE_DONE,
  Stat.AVG_KILL_PERCENT,
  Stat.NEUTRAL_WINS,
  Stat.L_CANCEL,
  Stat.FIRST_BLOOD,
  Stat.EARLY_KILLS,
  Stat.LATE_DEATHS,
  Stat.SELF_DESTRUCTS,
  Stat.HIGH_DAMAGE_PUNISHES,
  Stat.HIGH_DAMAGE_COMBOS,
  Stat.AVG_TIME_TO_KILL,
];

const DEFAULT_STATS = [Stat.INPUTS_PER_MINUTE, Stat.OPENINGS_PER_KILL, Stat.AVG_KILL_PERCENT, Stat.HIGH_DAMAGE_COMBOS];

const getDefaultStats = (): StatOption[] => {
  const current = DEFAULT_STATS.map((s) => ({
    statId: s,
    enabled: true,
  }));
  return validateStatOptions(current);
};

const validateStatOptions = (current: StatOption[]): StatOption[] => {
  const newItems: StatOption[] = ALL_STATS.filter(
    (statId) => !current.find((option) => option.statId === statId)
  ).map((statId) => ({ statId, enabled: false }));

  // Make sure the ones we're showing are supported
  const currentItems = current.filter((c) => ALL_STATS.includes(c.statId));
  return [...currentItems, ...newItems];
};

const generateStatsList = (options: StatOption[]): string[] => {
  // const statsList = options.filter((s) => s.enabled).map((s) => s.statId);
  return [
    Stat.INPUTS_PER_MINUTE,
    Stat.OPENINGS_PER_KILL,
    Stat.AVG_TIME_TO_KILL,
    Stat.HIGH_DAMAGE_COMBOS,
    Stat.KILL_MOVES,
  ];
};

export const FileListInput: React.FC = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(AppContext);
  const [error, setError] = React.useState<any>(null);
  const [showOptions, setShowOptions] = React.useState(false);

  const clearAll = () => {
    dispatch({
      type: Types.CLEAR_ALL,
    });
    history.push({
      pathname: "/",
    });
    resetHud();
  };

  let defaultStats = getDefaultStats();
  let statsModified = false;
  // Since we're persisting user options in localStorage, we need to be able to
  // handle the case where new options are available, yet not in their localStorage.
  const restoredStatsString = localStorage.getItem(STAT_OPTIONS_STORE_KEY);
  if (restoredStatsString) {
    statsModified = restoredStatsString !== JSON.stringify(defaultStats);
    defaultStats = validateStatOptions(JSON.parse(restoredStatsString));
  }

  const [statOptions, setStatOptions] = React.useState<StatOption[]>(defaultStats);

  const onStatOptionReset = () => {
    onStatOptionChange(getDefaultStats());
  };

  const onStatOptionChange = (options: StatOption[]) => {
    localStorage.setItem(STAT_OPTIONS_STORE_KEY, JSON.stringify(options));
    setStatOptions(options);
  };

  const onClick = () => {
    try {
      const gameDetails = state.files.filter((f) => f.details !== null).map((f) => f.details as GameDetails);
      const params = generateStatParams(gameDetails, generateStatsList(statOptions));
      const search = "?" + generateSearchParams(params).toString();
      history.push({
        search,
      });
      resetHud();
      const welcomeMessage = document.getElementById("welcome-message");
      fadeLoop(welcomeMessage as HTMLElement);
    } catch (err) {
      console.error(error);
      setError(err);
    }
  };

  const fadeLoop = (element: HTMLElement) => {
    element.style.display = "block";
    element.classList.add("fadeIn");
    timer = setTimeout(() => {
      element.classList.remove("fadeIn");
      element.classList.add("fadeOut");
      timer = setTimeout(() => {
        element.classList.remove("fadeOut");
        element.style.display = "none";
        let nextSibling = element.nextElementSibling;
        if (nextSibling == null) {
          nextSibling = document.getElementById("welcome-message");
        }
        fadeLoop(nextSibling as HTMLElement);
      }, 1000);
    }, 1000);
  };

  const onRemove = (filename: string) => {
    const gameDetails = state.files.filter((f) => f.details !== null).map((f) => f.details as GameDetails);
    const params = generateStatParams(gameDetails, generateStatsList(statOptions));
    const search = "?" + generateSearchParams(params).toString();
    history.push({
      search,
    });
    dispatch({
      type: Types.REMOVE_FILE,
      payload: {
        filename,
      },
    });
  };

  const resetHud = () => {
    clearTimeout(timer);
    const welcomeMessage = document.getElementById("welcome-message") as HTMLElement;
    welcomeMessage.classList.remove("fadeIn");
    welcomeMessage.classList.remove("fadeOut");
    (welcomeMessage as HTMLElement).style.display = "block";
    let element = (welcomeMessage as HTMLElement).nextElementSibling;
    while (element != null) {
      element.classList.remove("fadeIn");
      element.classList.remove("fadeOut");
      (element as HTMLElement).style.display = "none";
      element = element.nextElementSibling;
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Track how long processing takes
      const startTime = new Date().getTime();

      // First add all the files to the store
      dispatch({
        type: Types.ADD_FILES,
        payload: {
          files: acceptedFiles,
        },
      });

      const promises = acceptedFiles.map(async (file) => {
        try {
          const details = await readFileAsGameDetails(file);
          dispatch({
            type: Types.SET_DETAILS,
            payload: {
              filename: file.name,
              details,
            },
          });
        } catch (err) {
          console.error(error);
          dispatch({
            type: Types.SET_ERROR,
            payload: {
              filename: file.name,
              error: err,
            },
          });
        }
      });

      // Print the time taken when complete
      Promise.all(promises).then(() => {
        const time = new Date().getTime() - startTime;
        console.log(`Finished processing in ${time}ms`);
      });
    },
    [dispatch, error]
  );

  const finishedProcessing = !state.files.find((f) => f.loading);
  const buttonText =
    state.files.length === 0 ? "Start/Update Stats Bar" : finishedProcessing ? "Start/Update Stats Bar" : "Please Wait";

  if (showOptions) {
    return (
      <StatOptions
        onClose={() => setShowOptions(false)}
        value={statOptions}
        onChange={onStatOptionChange}
        onReset={onStatOptionReset}
        hideReset={!statsModified}
      />
    );
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        width: 100%;
        height: 100%;
      `}
    >
      <DropPad accept=".slp" onDrop={onDrop} />
      <div
        css={css`
          overflow: auto;
          display: flex;
          flex-direction: column;
          margin: 1rem 0;
        `}
      >
        <FileList files={state.files} onRemove={onRemove} />
      </div>
      <ControlsButton
        css={css`
          margin-bottom: 5px;
        `}
        color="white"
        disabled={state.files.length === 0 || !finishedProcessing}
        onClick={onClick}
      >
        {buttonText}
      </ControlsButton>
      {state.files.length > 0 && <ResetButton onClick={clearAll}>Reset</ResetButton>}
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </div>
  );
};
