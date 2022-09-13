import React from "react";
import { RunButton } from "./RunButton";
import styles from "./InputBox.module.scss";

export interface Props {
  runCommand: (command: string) => void;
  commandRunning: boolean;
  queryText: string;
  setQueryText: (value: string) => void;
}

export const CommandBox = ({
  runCommand,
  commandRunning,
  queryText,
  setQueryText
}: Props) => {
  return (
    <div className={styles.inputBox}>
      <label>Query:</label>

      <textarea
        className={styles.editor}
        value={queryText}
        onChange={event => setQueryText(event.target.value)}
        disabled={commandRunning}
      />

      <RunButton
        commandRunning={commandRunning}
        onClick={() => runCommand(queryText)}
      />
    </div>
  );
};
