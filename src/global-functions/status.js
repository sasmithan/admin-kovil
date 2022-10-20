const customerOrderStatus = function (status) {
  status = parseInt(status);
  switch (status) {
    case 0:
      return "DRAFT";

    case 1:
      return "WAITING";

    case 2:
      return "RECVD";

    case 3:
      return "PUT AWAY";

    case 4:
      return "PRECVD";

    case 5:
      return "STORED";

    case 6:
      return "PSTORED";
    case 7:
      return "PROCSD";
    case 8:
      return "PPROCSD";
  }
};

//  case 0:
//       return "DRAFT";

//     case 1:
//       return "NEW";

//     case 2:
//       return "ACCEPTED";

//     case 3:
//       return "PICKED";

//     case 4:
//       return "PROCESS";

//     case 5:
//       return "COMPLETE";

//     case 6:
//       return "DESPATCH";

const customerOrderStatusColor = function (status) {
  status = parseInt(status);
  switch (status) {
    case 0:
      return "background-color: blue; ";

    case 1:
      return "background-color: chocolate;";

    case 2:
      return "background-color: green;";

    case 3:
      return "background-color: purple";

    case 4:
      return "background-color: orange";

    case 5:
      return "background-color: lime";

    case 6:
      return "background-color: maroon";
  }
};

const supplierInvoiceStatus = function (status) {
  status = parseInt(status);
  switch (status) {
    case 0:
      return "DRAFT";

    case 1:
      return "NEW";

    case 2:
      return "ACCEPTED";

    case 3:
      return "PICKED";

    case 4:
      return "PROCESS";

    case 5:
      return "COMPLETE";

    case 6:
      return "DESPATCH";

    case 7:
      return "DELIVERED";

    case 8:
      return "RETURN";
  }
};

const supplierInvoiceStatusColor = function (status) {
  status = parseInt(status);
  switch (status) {
    case 0:
      return "background-color: blue; ";

    case 1:
      return "background-color: chocolate;";

    case 2:
      return "background-color: green;";

    case 3:
      return "background-color: purple";

    case 4:
      return "background-color: orange";

    case 5:
      return "background-color: red";

    case 6:
      return "background-color: maroon";

    case 7:
      return "background-color: navy";

    case 8:
      return "background-color: black";
  }
};
const getPickingType = function (status) {
  switch (status) {
    case 0:
      return "Regular Pick";

    case 1:
      return "Pallet Pick";

    case 2:
      return "Cross Stock";
  }
};

const getPickingTypeColor = function (status) {
  switch (status) {
    case 0:
      return "background-color: blue; ";

    case 1:
      return "background-color: chocolate;";

    case 2:
      return "background-color: green;";
  }
};
const booleanStatus = function (status) {
  switch (status) {
    case true:
      return "YES";

    case false:
      return "NO";
  }
};
const booleanStatusColor = function (status) {
  switch (status) {
    case true:
      return "border: 1px solid; border-color: green; color: black";

    case false:
      return "border: 1px solid; border-color: red;  color: white";
  }
};

export {
  booleanStatus,
  booleanStatusColor,
  customerOrderStatus,
  customerOrderStatusColor,
  supplierInvoiceStatus,
  supplierInvoiceStatusColor,
  getPickingType,
  getPickingTypeColor,
};
