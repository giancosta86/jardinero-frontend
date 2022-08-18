import React, { useState } from "react";
import { RunButton } from "./RunButton";
import styles from "./InputBox.module.scss";

export interface Props {
  runCommand: (command: string) => void;
  commandRunning: boolean;
}

export const CommandBox = ({ runCommand, commandRunning }: Props) => {
  const [queryText, setQueryText] =
    useState<string>(`SELECT '-tad nouns' AS 'Noun type', COUNT(*) AS Quantity
FROM nouns
WHERE entry LIKE '%tad'
UNION ALL
SELECT '-dad nouns' AS 'Noun type', COUNT(*) AS Quantity
FROM nouns
WHERE entry LIKE '%dad'`);

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
