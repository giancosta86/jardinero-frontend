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
