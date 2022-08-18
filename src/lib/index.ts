export const SocketMessages = Object.freeze({
  dictionaryStatusRequest: "dictionary_status_request",
  dictionaryStatusResponse: "dictionary_status_response",
  startPipeline: "start_pipeline",
  cancelPipeline: "cancel_pipeline",
  runCommand: "run_command",
  commandResponse: "command_response"
});

export const QueryParams = {
  backendPort: "backend-port"
};

export interface DictionaryStatus {
  statusMessage: string | null;
  pipelineMessage: string | null;
  errorInPreviousPipeline: string | null;
}

export interface CommandResponse {
  exception: string | null;
  headers: string[] | null;
  rows: any[][] | null;
}
