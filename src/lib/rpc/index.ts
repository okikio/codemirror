import RequestManager from "./RequestManager";
import PostMessageWorkerTransport from "./transports/PostMessageWorkerTransport";
import { JSONRPCError } from "./Error";
import Client from "./Client";

// Based off of https://www.npmjs.com/package/@open-rpc/client-js
export default Client;
export {
  Client,
  RequestManager,
  JSONRPCError,
  PostMessageWorkerTransport,
};
