import { createApp } from "vue";

import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import simpleComponents from "./simple-components";
import utils from "./utils";
import "./assets/css/app.css";

 

//import signalRHub from "./signalR";

// signalRHub.setupSignalRConnection().then(_ => {
//     signalRHub.sendMessage("Hello").then(response => {
//         console.log(response);
//     });
// });

//signalRHub.start(); 
 
const app = createApp(App).use(router).use(createPinia());

globalComponents(app);
simpleComponents(app);
utils(app);

app.mount("#app");
