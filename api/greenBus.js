const axios = require("axios");

const rootUrl = `https://n784k2f6s0.execute-api.ap-southeast-1.amazonaws.com/prod`;

module.exports.greenBusRequest = async () => {
  let result = {};

  const response = await axios.get(`${rootUrl}/green-bus`);
  if (response) {
    const responseData = response.data;
    console.log("responseData = ", responseData);

    if (responseData) {
      const data = {
        name: responseData.greenBus.name,
        vehicles: responseData.greenBus.vehicles,
      };
      result = data;
    }
  }

  return result;
};
