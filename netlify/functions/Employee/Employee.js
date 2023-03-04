const handler = async (event, context) => {
  try {
    const api = event.path?.split("/").reverse()[0];
    let response = {
      status: 1,
      code: 1,
      msg: "",
      info: "",
    };
    switch(api) {
      case "viewCont": response = {}; break;
      case "addField": response = {}; break;
      case "taxDeduct": response = {}; break;
      case "getStaffInfo": response = {}; break;
      case "getTableField": response = {}; break;
      case "getTabsInfo": response = {}; break;
      case "getDeductionInfo": response = {}; break;
      case "saveStaffInfo": response.msg = "Saved successfully."; break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }


