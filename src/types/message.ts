export enum messageAction {
  Add = 0,
  Remove = 1,
  Ping = 2,
  Null = 3,
}

export enum taskStatus {
  Stopped = 0,
  Starting = 1,
  Running = 2,
  Ready = 3,
}

export enum taskType {
  Enumeration = 0,
  BruteForce = 1,
  Null = 2,
}

export type result = {
  bruteForce?: bruteResult,
  userEnumeration?: enumResult[],
}

export type bruteResult = {
  username: string,
  password: string,
}

export type enumResult = {
  id: string,
  name: string,
  description: string,
  link: string,
  url: string,
  slug: string,
}

export type message = {
  messageAction: messageAction,
  taskType: taskType,
  id: number,
  name: string,
  url: string,
  percentage: number,
  result?: result,
  status?: taskStatus,
}

//

export type rxMessage = {
  MessageAction: messageAction,
  TaskType: taskType,
  Id: number,
  Name: string,
  Url: string,
  Percentage: number,
  Result?: result,
  Status?: taskStatus,
}

export type txMessage = {
  messageAction: messageAction,
  taskType: taskType,
  url: string,
  name: string,
}

export type txPing = {
  messageAction: messageAction,
}