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
      case "getLogininfo": response.info = {"lastip":"124.33.250.154","lasttime":"1673370342","companyid":"50330008","cid":"50330008","vip":"1","member_view_id":"0","username":"John Smith II","uheadimg":"55da1bde-f558-4b62-5552-ee53f5354dd0.png"}; break;
      case "getCompanyinfo": response = {"data":{"name":"Abc123","industry":"","phone":"123","describe":"","bank":"","bankaccount":"","logo":"50009807.jpg","title":"","registry":"","address":"Abc123","einnumber":"","regaddress":"","regphone":"13701903136","file":"\/Uploads\/"},"status":1,"url":""}; break;
      case "authenticationGetInfo": response = {"code":1,"data":{"id":1,"cid":50009807,"cname":"Abc123","province":"北京市","city":"市辖区","district":"东城区","address":"Abc123","ctelephone":"123","linkman":"Abc123","phone":"13701903136","license":"754b387c-4761-4e0a-b9c7-f8b5fd3938a0.jpg","email":"","postal_code":"","industry":"","invoice_title":"","bank_of_deposit":"","bank_account":"","register":"91440112725619185Q","describe":"","type":1,"apply_time":1576056852,"examine_time":1528692900,"state":0,"logo":"微信图片_20191211190035.png","fw_cid":0,"identity_photo_front":"","identity_photo_back":"","legal_representative":""},"msg":"Abc123"}; break;
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
