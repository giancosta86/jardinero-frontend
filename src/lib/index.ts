export const enum SocketMessages {
  DictionaryStatusRequest = "dictionary_status_request",
  DictionaryStatusResponse = "dictionary_status_response",
  StartPipeline = "start_pipeline",
  CancelPipeline = "cancel_pipeline",
  RunCommand = "run_command",
  CommandResponse = "command_response"
}

export const enum QueryParams {
  BackendPort = "backend-port"
}

export interface DictionaryStatus {
  statusMessage: string | null;
  pipelineMessage: string | null;
  errorInPreviousPipeline: string | null;
}

export interface CommandResponse {
  exception: string | null;
  headers: readonly string[] | null;
  rows: readonly (readonly any[])[] | null;
}
