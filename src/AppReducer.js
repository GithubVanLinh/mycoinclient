// app reducer
const AppReducer = (state, action) => {
  switch (action.type) {
    case "set_ws":
      return {
        ...state,
        ws: action.ws,
      };
    case "request-chain":
      return {
        ...state,
        chain: action.chain,
      };
    case "request-transactions":
      return {
        ...state,
        transactions: action.transactions,
      };
    case "send-message":
      return {
        ...state,
        message: action.message,
      };
    case "SET_KEY":
      return {
        ...state,
        key: action.key,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.message,
      };
    case "SET_SEND_MESSAGE":
      return {
        ...state,
        sendMessage: action.sendMessage,
      };
    default:
      return state;
  }
};

export default AppReducer;
