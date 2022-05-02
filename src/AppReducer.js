// app reducer
const AppReducer = (state, action) => {
  switch (action.type) {
    case "set_balance":
      return {
        ...state,
        balance: action.balance,
      };
    case "set_public_key":
      return {
        ...state,
        public_key: action.public_key,
      };
    case "set_private_key":
      return {
        ...state,
        private_key: action.private_key,
      };
    case "set_key":
      return {
        ...state,
        key: action.key,
      };
    case "set_keys":
      return {
        ...state,
        key: action.key,
        public_key: action.public_key,
        private_key: action.private_key,
      };
    case "set_wallet":
      return {
        ...state,
        wallet: action.wallet,
      };
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
    default:
      return state;
  }
};

export default AppReducer;
