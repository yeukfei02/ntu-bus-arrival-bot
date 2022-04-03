const axios = require("axios");

const rootUrl = `https://n784k2f6s0.execute-api.ap-southeast-1.amazonaws.com/prod`;

module.exports.busArrivalRequest = async (busStopId) => {
  let result = {};

  const response = await axios.get(`${rootUrl}/bus-arrival`, {
    params: {
      busStopId: busStopId,
    },
  });
  if (response) {
    const responseData = response.data;
    console.log("responseData = ", responseData);

    if (responseData) {
      const data = {
        name: responseData.busArrival.name,
        forecasts: responseData.busArrival.forecasts,
        geometries: responseData.busArrival.geometries,
      };
      result = data;
    }
  }

  return result;
};
