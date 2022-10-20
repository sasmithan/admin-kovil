import {
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import axios from "./services/http-common";
var signalRUrl = axios.defaults.baseURL.replace("api/", "hubs/dashboard");
var hubConnection = null;

export default {
  start() {
    //signalRUrl = signalRUrl + "?access_token=" + store.getters["authUser/token"]
    hubConnection = new HubConnectionBuilder()
      .withUrl(signalRUrl)
      .withAutomaticReconnect([0, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    hubConnection.on("RecieveMessage", (message) => {
      console.log("RecieveMessage:", message);
    });

    hubConnection.onreconnecting((error) => {
      console.assert(hubConnection.state === HubConnectionState.Reconnecting);
      console.log("SignalR is Reconnecting...", error);
    });

    hubConnection.onreconnected((connectionId) => {
      console.assert(hubConnection.state === HubConnectionState.Connected);
      console.log("SignalR Reconnected with " + connectionId);
    });

    hubConnection.onclose((error) => {
      console.assert(hubConnection.state === HubConnectionState.Disconnected);
      console.log("SignalR Disconnected. ", error);
    });

    return this.startSignalRConnection(hubConnection);
  },

  async startSignalRConnection(connection) {
    try {
      await connection.start();
      console.assert(connection.state === HubConnectionState.Connected);

      console.log("SignalR :", connection.state);

      return Promise.resolve("SignalR Connected.");
    } catch (err) {
      console.assert(connection.state === HubConnectionState.Disconnected);
      console.log("SignalR :", connection.state);
      return Promise.reject("SignalR not Connected");
    }
  },

  sendMessage(message) {
    return new Promise(async (resolve, reject) => {
      if (
        hubConnection != null &&
        hubConnection.state === HubConnectionState.Connected
      ) {
        let result = await hubConnection.invoke("SendMessage", message);
        resolve(result);
      } else {
        reject("no connection");
      }
    });
  },
};

// import {
//   HubConnectionBuilder,
//   LogLevel,
//   HubConnectionState,
// } from "@microsoft/signalr";
// import axios from "./services/http-common";
// var signalRUrl = axios.defaults.baseURL.replace("api/", "hubs/dashboard");
// var hubConnection = null;

// //import store from "@/store";
// //connecting: 0, connected: 1, reconnecting: 2, disconnected: 4
// export default () => {
//   hubConnection = new HubConnectionBuilder().withUrl(signalRUrl).build();

//   hubConnection.on("RecieveMessage", (message) => {
//     console.log("RecieveMessage:", message);
//   });

//   // hubConnection.on("sendMessage", (data) => {
//   //   console.log("Worked");
//   //   console.log(data);
//   // });

//   let started = hubConnection.start();
//   let orderNumber = "0015";
//   let warehouse = "DFLT";
//  started.then(() => hubConnection.invoke("SendMessage", "message"));
//   started.then(() =>
//     hubConnection.invoke(
//       "SendMessage",
//       orderNumber

//     )
//   );

//   // hubConnection.start().then(() => console.log("Connected"));
// };
