// Based off of https://www.npmjs.com/package/@open-rpc/client-js
import { Transport } from "./Transport";
import { type JSONRPCRequestData, type IJSONRPCData, getNotifications } from "../Request";

export class PostMessageWorkerTransport extends Transport {
  public worker: undefined | null | Worker;
  public postMessageID: string;

  constructor(worker: Worker) {
    super();
    this.worker = worker;
    this.postMessageID = `post-message-transport-${Math.random()}`;
  }
  private messageHandler = (ev: MessageEvent) => {
    console.log("Message Handler", ev.data)
    this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
  }
  public connect(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.worker?.postMessage(["--useSingleInferredProject", "--locale=en"]);
        this.worker?.addEventListener?.("message", this.messageHandler);
        resolve();
      } catch (err) { 
        reject(err);
      }
    });
  }

  public async sendData(data: JSONRPCRequestData, timeout: number | null = 5000): Promise<any> {
    const prom = this.transportRequestManager.addRequest(data, null);
    const notifications = getNotifications(data);
    if (this.worker) {
      this.worker.postMessage((data as IJSONRPCData).request);
      this.transportRequestManager.settlePendingRequest(notifications);
    }
    return prom;
  }

  public close(): void {
    this.worker?.removeEventListener?.("message", this.messageHandler);
    this.worker?.terminate();
  }

}

export default PostMessageWorkerTransport;