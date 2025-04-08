const mongoose = require('mongoose');
const ApiLogs = require('../models/api-logs.model');
const { stringify } = require('flatted');  // Import the flatted library

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const logApiCall = async (clientId, leadId, requestBody, response, responseStatusCode, extraDetails = {}) => {
  try {
    if (!isValidObjectId(clientId)) {
      throw new Error("Invalid clientId format");
    }

    if (extraDetails instanceof Error) {
      extraDetails = {
        message: extraDetails?.message,
        stack: extraDetails?.stack,
        code: extraDetails?.code,
        config: extraDetails?.config || extraDetails?.error,
        errorResponse: extraDetails?.error?.response,
        requestHeader: extraDetails?.requestHeader || {}
      };
    }

    const safeExtraDetails = stringify(extraDetails);

    const apiLog = new ApiLogs({
      clientId: new mongoose.Types.ObjectId(clientId),
      leadId,
      requestBody,
      response,
      responseStatusCode,
      isSuccess: responseStatusCode === 201 || responseStatusCode === 200,
      extraDetails: safeExtraDetails
    });
    return await apiLog.save();
  } catch (error) {
    throw Error(error);
  }
};

module.exports = { logApiCall };
