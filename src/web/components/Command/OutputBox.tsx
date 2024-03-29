import React from "react";
import { CommandResponse } from "@lib/shared";
import styles from "./OutputBox.module.scss";

export interface Props {
  commandResponse: CommandResponse;
}

export const OutputBox = ({ commandResponse }: Props) => {
  return (
    <div className={styles.outputBox}>
      {commandResponse.exception && (
        <div className={styles.errorBox}>{commandResponse.exception}</div>
      )}

      {commandResponse.dataSet && (
        <>
          <div className={styles.countBox}>
            <label>Total rows: </label> {commandResponse.dataSet.rows.length}
          </div>

          <table>
            <thead>
              {commandResponse.dataSet.headers.map((header, index) => (
                <td key={index}>{header}</td>
              ))}
            </thead>
            <tbody>
              {commandResponse.dataSet.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <td key={columnIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
