import { CommandResponse, DictionaryStatus } from "../../lib";

export type DictionaryStatusListener = (
  dictionaryStatus: DictionaryStatus
) => void;

export type CommandResponseListener = (
  commandResponse: CommandResponse
) => void;
