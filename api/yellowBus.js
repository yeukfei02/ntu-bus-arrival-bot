const axios = require("axios");

const rootUrl = `https://n784k2f6s0.execute-api.ap-southeast-1.amazonaws.com/prod`;

module.exports.yellowBusRequest = async () => {
  let result = {};

  const response = await axios.get(`${rootUrl}/yellow-bus`);
  if (response) {
    const responseData = response.data;
    console.log("responseData = ", responseData);

    if (responseData) {
      const data = {
        name: responseData.yellowBus.name,
        vehicles: responseData.yellowBus.vehicles,
      };
      result = data;
    }
  }

  return result;
};
