function responseModel({ data = null, isSuccess = true, responseMessage = null }) {
  return {
    data: data,
    isSuccess: isSuccess,
    responseMessage: responseMessage,
  };
}

export default responseModel;
