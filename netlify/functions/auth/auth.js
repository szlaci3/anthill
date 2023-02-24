// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
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
      case "login": response.info = {"lastip":"124.33.250.154","lasttime":"1673370342","companyid":"50330008","cid":"50330008","vip":"1","member_view_id":"0","username":"abc","uheadimg":"55da1bde-f558-4b62-5552-ee53f5354dd0.png"}; break;
      case "logout": response = {"man":"29","women":"12"}; break;
      case "getLogininfo": response.data = {"man":"29","women":"12"}; break;
      case "getCompanyinfo": response = {"man":"29","women":"12"}; break;
      case "authenticationGetInfo": response = {"man":"29","women":"12"}; break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
