const axios = require("axios");

const rootUrl = `https://n784k2f6s0.execute-api.ap-southeast-1.amazonaws.com/prod`;

module.exports.busStopDetailsRequest = async (type) => {
  let result = {};

  const response = await axios.get(`${rootUrl}/bus-stop-details`);
  if (response) {
    const responseData = response.data;
    console.log("responseData = ", responseData);

    if (responseData) {
      const busStopDetails = responseData.busStopDetails;
      result = busStopDetails[type];
    }
  }

  return result;
};
