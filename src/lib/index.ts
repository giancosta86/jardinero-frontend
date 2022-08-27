export enum SocketMessages {
  DictionaryStatusRequest = "dictionary_status_request",
  DictionaryStatusResponse = "dictionary_status_response",
  StartPipeline = "start_pipeline",
  CancelPipeline = "cancel_pipeline",
  RunCommand = "run_command",
  CommandResponse = "command_response"
}

export enum QueryParams {
  BackendPort = "backend-port"
}

export type DictionaryStatus = Readonly<{
  statusMessage: string | null;
  pipelineMessage: string | null;
  errorInPreviousPipeline: string | null;
}>;

export type DataRow = readonly any[];

export type DataSet = Readonly<{
  headers: readonly string[];
  rows: readonly DataRow[];
}>;

export type CommandResponse = Readonly<{
  exception: string | null;
  dataSet: DataSet | null;
}>;
