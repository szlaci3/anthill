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
      case "data": response = {"code":1,"data":{"cols":{"column_0":"员工编号","column_1":"Name","column_2":"ID","column_3":"CrtNum","column_4":"Gender","column_5":"City","column_6":"Status","column_7":"Position","column_8":"Hon","column_9":"Start","column_10":"Dateq","column_11":"Date2","column_12":"Space","column_13":"Work"},"data":[{"column_0":3077653,"column_1":"me","column_2":"430521198405566642","column_3":"22","column_4":"F","column_5":"BERLIN","column_6":"In Office","column_7":"Developer","column_8":"Contract2","column_9":"20180831","column_10":"20180831","column_11":"20180930","column_12":"Remote","column_13":"it2"},{"column_0":3077654,"column_1":"Justin","column_2":"430521198403166642","column_3":"","column_4":"F","column_5":"","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"2","column_13":"11123"},{"column_0":3077695,"column_1":"Sibyr","column_2":"310103199111064011","column_3":"","column_4":"","column_5":"","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"3","column_13":"jhkjh"},{"column_0":3077794,"column_1":"ffff","column_2":"310101198310311017","column_3":"","column_4":"M","column_5":"asdf as","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"3","column_13":"0000"},{"column_0":3078055,"column_1":"Ella","column_2":"310103199111064014","column_3":"","column_4":"","column_5":"","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"1","column_13":"it"},{"column_0":3078068,"column_1":"Jerry","column_2":"110101199003078494","column_3":"","column_4":"","column_5":"","column_6":"Dismissed","column_7":"Developer","column_8":"Contract2","column_9":"20230119","column_10":"20230119","column_11":"20230120","column_12":"","column_13":""},{"column_0":3078072,"column_1":"xu","column_2":"110101199003070791","column_3":"","column_4":"","column_5":"","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"4","column_13":"3"},{"column_0":3078101,"column_1":"Mlad","column_2":"310101198310311017","column_3":"","column_4":"M","column_5":"","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"Remote","column_13":"123"},{"column_0":3078104,"column_1":"Octab","column_2":"","column_3":"","column_4":"","column_5":"","column_6":"In Office","column_7":"","column_8":"Old Contract","column_9":"","column_10":"","column_11":"","column_12":"Remote","column_13":""},{"column_0":3078109,"column_1":"Kinga","column_2":"110101199003075859","column_3":"","column_4":"","column_5":"","column_6":"Dismissed","column_7":"","column_8":"Old Contract","column_9":"","column_10":"","column_11":"","column_12":"","column_13":""},{"column_0":3078110,"column_1":"Yan","column_2":"110101199003071401","column_3":"","column_4":"","column_5":"","column_6":"Dismissed","column_7":"","column_8":"Old Contract","column_9":"","column_10":"","column_11":"","column_12":"","column_13":""},{"column_0":3078116,"column_1":"Kole","column_2":"310101198310311017","column_3":"","column_4":"M","column_5":"上海","column_6":"In Office","column_7":"","column_8":"Contract2","column_9":"","column_10":"","column_11":"","column_12":"1","column_13":"2"}],"page":{"current":"1","max":1},"sort":{"col":"column_0","type":"asc"},"search_keyword":""},"msg":"获取成功"}; break;
      case "addRow": response = {"man":"29","women":"12"}; break;
      case "addExcel": response = {"man":"29","women":"12"}; break;
      case "delRow": response = {"man":"29","women":"12"}; break;
      case "sendContract": response = {"man":"29","women":"12"}; break;
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


