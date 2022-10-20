import Toastify from "toastify-js";
import warning from "../../assets/images/warning.png"
import failed from "../../assets/images/failed.png"
import success from "../../assets/images/success.png"


const statusMessage = function(status){
  status = parseInt(status);
  switch (status) {
    case 400:
      return "The server cannot or will not process the request due to something that is perceived to be a client error";

    case 401:
      return "You have no access to this page";

    case 403:
      return "You don't have permission to access on this site";

    case 404:
      return "Oops... Page not found";

    case 408:
      return "Your browser didn't send a complete request in time";
    
    case 415:
      return "The server is not connected";

    case 500:
      return "The server has been deserted for a while";

    case 502:
      return "No appropriate server could be found to route the request";
    
    case 503:
      return "The server is not ready to handle the request";
    
    default:
      return "Something went wrong...";
  }
};

const failedToast = function (apiMessage) {
  Toastify({
    text: apiMessage,
    avatar: failed,
    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      textAlignment:"right",
      color: "red",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "30%",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};

const successToast = function (apiMessage) {
  Toastify({
    text: apiMessage,
    avatar: success,

    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      textAlignment:"right",
      color: "green",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "30%",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};

const warningToast = function (status) {
  statusMessage(status)
  Toastify({
    text: status,
    avatar: warning,
    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      textAlignment:"right",
      color: "orange",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "30%",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};
export { successToast, failedToast, warningToast, statusMessage };
