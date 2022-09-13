import React from "react";
import { DictionaryStatus } from "@lib/shared";
import { PipelineBox } from "./PipelineBox";
import { StatusBox } from "./StatusBox";
import styles from "./index.module.scss";

export interface Props {
  dictionaryStatus: DictionaryStatus;
  startPipeline: () => void;
  cancelPipeline: () => void;
}

export const DictionaryBox = ({
  dictionaryStatus,
  startPipeline,
  cancelPipeline
}: Props) => {
  const hasDictionary = dictionaryStatus.statusMessage != null;

  return (
    <div className={styles.dictionaryBox}>
      <StatusBox
        statusMessage={dictionaryStatus.statusMessage}
        errorInPreviousPipeline={dictionaryStatus.errorInPreviousPipeline}
      />

      <PipelineBox
        hasDictionary={hasDictionary}
        pipelineMessage={dictionaryStatus.pipelineMessage}
        startPipeline={startPipeline}
        cancelPipeline={cancelPipeline}
      />
    </div>
  );
};
