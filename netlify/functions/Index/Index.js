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
      case "customerIndex": response = {"onjobCount":"43","waitOnJob":"0","contract_to_expire":"0","unexecuted_contract":"32","contract_try_end":"0"}; break;
      case "mawStaff": response = {"man":"29","women":"12"}; break;
      case "joinOutStaff": response = {"joinCount":{"6":"7","5":"9","4":"10","3":"5","2":"0","1":"0"},"outCount":{"6":"3","5":"3","4":"0","3":"0","2":"2","1":"2"},"tryCount":{"6":"10","5":"0","4":"10","3":"0","2":"10","1":"0"}}; break;
      case "sbxzCostChange": response = {"sb":{"6":10,"5":10,"4":6,"3":7,"2":5,"1":8},"xz":{"6":3,"5":4,"4":3,"3":2,"2":4,"1":7}}; break;
      case "companyStaffInfo": response.data = {"sex":{"男":54,"女":22},"dept":{"Now":3,"Hello":5,"ABC":5,"1on":4,"412":2,"1":1,"lorem":3,"Bpts":5,"322":1,"323":1,"324":1,"325":1,"326":1,"3261":1,"3262":1,"327":1,"3264more":1,"Abcaae":1,"a":2}}; break;
      case "getStatistics": response.data = 0; break;
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
