export enum MessageAction {
  Add = 0,
  Remove = 1,
  Ping = 2,
  Null = 3,
}

export enum TaskStatus {
  Stopped = 0,
  Starting = 1,
  Running = 2,
  Ready = 3,
}

export enum TaskType {
  Enumeration = 0,
  BruteForce = 1,
  Null = 2,
}

export type Result = {
  BruteForce?: BruteResult,
  UserEnumeration?: EnumResult[],
}

export type BruteResult = {
  Username: string,
  Password: string,
}

export type EnumResult = {
  Id: string,
  Name: string,
  Description: string,
  Link: string,
  Url: string,
  Slug: string,
}

export type RxMessage = {
  MessageAction: MessageAction,
  TaskType: TaskType,
  Id: number,
  Name: string,
  Url: string,
  Percentage: number,
  TaskResult?: Result,
  Status?: TaskStatus,
}

export type TxMessage = {
  MessageAction: MessageAction,
  TaskType: TaskType,
  Url: string,
  Name: string,
}

//
export type TxPing = {
  MessageAction: MessageAction,
}