import { Transport } from "./Transport";
import { type JSONRPCRequestData, type IJSONRPCData, getNotifications } from "../Request";

export class PostMessageWorkerTransport extends Transport {
  // public uri: string;
  public worker: undefined | null | Worker;
  public postMessageID: string;

  constructor(worker: Worker) {
    super();
    // this.uri = uri;
    this.worker = worker;
    this.postMessageID = `post-message-transport-${Math.random()}`;
  }
  // public createWorker(uri: string): Promise<Worker | null> {
  //   return new Promise((resolve, reject) => {
  //     const worker = new Worker(uri, {
  //       type: "module",
  //       name: this.postMessageID,
  //     });
  //     resolve(worker);
  //   });
  // }
  private messageHandler = (ev: MessageEvent) => {
    console.log("Message Handler", ev.data)
    this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
  }
  public connect(): Promise<any> {
    // const urlRegex = /^(http|https):\/\/.*$/;
    return new Promise<void>(async (resolve, reject) => {
      try {
        // if (!urlRegex.test(this.uri)) {
        //   reject(new Error("Bad URI"));
        // }
        // this.worker = await this.createWorker(this.uri);
        // this.worker.postMessage(["--useSingleInferredProject", "--locale=en"]);
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
    // const el = document.getElementById(this.postMessageID);
    // el?.remove();
    this.worker?.removeEventListener?.("message", this.messageHandler);
    this.worker?.terminate();

  }

}

export default PostMessageWorkerTransport;