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
      case "deptData": response = {"data":[{"id":"1","name":"Musician","pid":"0"},{"id":"9","name":"Drummer","pid":"1"},{"id":"10","name":"Pianist","pid":"9"},{"id":"11","name":"Trumpetist","pid":"9"},{"id":"12","name":"Guitarist","pid":"9"},{"id":"13","name":"Violonist","pid":"9"}]}; break;
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


