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
      case "getTitle": response = {"code":1,"data":{"0":{"id":1,"name":"Home","pid":0},"1":{"id":2,"name":"Staff","pid":0},"2":{"id":3,"name":"Form","pid":2},"3":{"id":4,"name":"Table","pid":2},"4":{"id":5,"name":"员工假期管理","pid":2},"5":{"id":6,"name":"组织架构设置","pid":2},"6":{"id":7,"name":"社保薪资管理","pid":0},"7":{"id":8,"name":"支付明细","pid":7},"8":{"id":9,"name":"社保管理","pid":7},"9":{"id":10,"name":"薪资管理","pid":7},"10":{"id":11,"name":"员工福利","pid":0},"11":{"id":12,"name":"公告发布","pid":0},"12":{"id":13,"name":"审批管理","pid":0},"13":{"id":14,"name":"报销","pid":13},"14":{"id":15,"name":"考勤管理","pid":0},"15":{"id":16,"name":"考勤","pid":15},"16":{"id":17,"name":"考勤统计","pid":15},"17":{"id":18,"name":"调岗记录","pid":2},"18":{"id":19,"name":"菜单","pid":0},"19":{"id":20,"name":"账户设置","pid":0},"20":{"id":21,"name":"权限设置","pid":0},"21":{"id":22,"name":"企业认证","pid":0},"39":{"id":52,"name":"社保申报查询","pid":2}}}; break;
      case "getSocialPolicyCity": response = {}; break;
      case "getSocialPolicyData": response = {}; break;
      case "parseIdentity": response = {"identity":"430521198403166642","birth":"1984-12-16","sex":"F"}; break;
      case "getUploadToken": response = {}; break;
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


