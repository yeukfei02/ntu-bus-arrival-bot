const axios = require("axios");

const rootUrl = `https://n784k2f6s0.execute-api.ap-southeast-1.amazonaws.com/prod`;

module.exports.blueBusRequest = async () => {
  let result = {};

  const response = await axios.get(`${rootUrl}/blue-bus`);
  if (response) {
    const responseData = response.data;
    console.log("responseData = ", responseData);

    if (responseData) {
      const data = {
        name: responseData.blueBus.name,
        vehicles: responseData.blueBus.vehicles,
      };
      result = data;
    }
  }

  return result;
};
