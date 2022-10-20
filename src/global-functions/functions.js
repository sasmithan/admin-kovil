import Toastify from "toastify-js";
import warning from "../assets/images/warning.png";
import failed from "../assets/images/failed.png";
import success from "../assets/images/success.png";

const statusMessage = function (status) {
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
      textAlignment: "right",
      color: "red",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "300px",
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
      textAlignment: "right",
      color: "green",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "300px",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};

const warningToast = function (apiMessage) {
  Toastify({
    text: apiMessage,
    avatar: warning,
    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      textAlignment: "right",
      color: "orange",
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "300px",
    },
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
};

const currencyFormat = function (val) {
  return val ? "$" + parseFloat(val).toFixed(2) : "$0.00";
};
const percentageFormat = function (val) {
  return val ? val + "%" : "Nil";
};

const temperatureFormat = function (val) {
  return val ? val + "°C" : "Nil";
};

const weightFormat = function (val) {
  return val ? val + "Kg" : "Nil";
};

const removeNullValue = function (item) {
  Object.keys(item).forEach((key) => {
    if (item[key] === null) {
      item[key] = "";
    }
  });
};

const removeDuplicate = function (array) {
  var uniqueArray = [];

  if (array.length >= 0) {
    for (var i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) {
        uniqueArray.push(array[i]);
      }
    }
    return uniqueArray;
  }
};

const exportCSVFile = function (csvHeaders, csvItems, csvTitle) {
  if (csvHeaders) {
    csvItems.unshift(csvHeaders);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(csvItems);
  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = csvTitle || "export.csv";
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
const convertToCSV = function (objArray) {
  console.log("convertToCSV");
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
};

const getStatusColor = function (value) {
  try {
    if (value == true) {
      return "#006900";
    } else {
      return "#8a0000";
    }
  } catch {
    return "";
  }
};

const getSelectedColor = function () {
  return "background-color: #25060695 ;color: white;";
};
const getSelectedItemColor = function () {
  return "border:1px solid #b91c1c ";
};

const getStatus = function (value) {
  try {
    if (value == true) {
      return "Active";
    } else {
      return "Deactive";
    }
  } catch {
    return "";
  }
};

const getAliveStatus = function (value) {
  try {
    if (value == true) {
      return "Alive";
    } else {
      return "Deceased";
    }
  } catch {
    return "";
  }
};

const getBookingStatusColor = function (value) {
  try {
    if (value == true) {
      return "#006900";
    } else {
      return "#8a0000";
    }
  } catch {
    return "";
  }
};
const getBookingStatus = function (value) {
  value = parseInt(value);
  switch (value) {
    case 0:
      return "NEW";

    case 1:
      return "AWAITING";

    case 2:
      return "IN PROGRESS";

    case 3:
      return "COMPLETED";

    case 4:
      return "CANCELLED";

    case 5:
      return "REFUND";

    default:
      return "";
  }
};

export {
  successToast,
  failedToast,
  warningToast,
  statusMessage,
  currencyFormat,
  percentageFormat,
  temperatureFormat,
  weightFormat,
  removeNullValue,
  removeDuplicate,
  exportCSVFile,
  getStatusColor,
  getStatus,
  getAliveStatus,
  getSelectedColor,
  getSelectedItemColor,
  getBookingStatusColor,
  getBookingStatus,
};
