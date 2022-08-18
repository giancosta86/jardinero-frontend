import React from "react";
import { CommandResponse } from "../../../lib";
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

      {commandResponse.headers && commandResponse.rows && (
        <>
          <div className={styles.countBox}>
            <label>Total rows: </label> {commandResponse.rows.length}
          </div>

          <table>
            <thead>
              {commandResponse.headers.map((header, index) => (
                <td key={index}>{header}</td>
              ))}
            </thead>
            <tbody>
              {commandResponse.rows.map((row, rowIndex) => (
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
