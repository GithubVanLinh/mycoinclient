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
      const history = [];
      state.chain.forEach((block) => {
        block.transactions.forEach((transaction) => {
          if (transaction.fromAddress === action.public_key) {
            history.push({
              type: "sent",
              to: transaction.toAddress,
              amount: transaction.amount,
              timestamp: block.timestamp,
            });
          }
          if (transaction.toAddress === action.public_key) {
            history.push({
              type: "received",
              from: transaction.fromAddress,
              amount: transaction.amount,
              timestamp: block.timestamp,
            });
          }
        });
      });
      console.log("src/AppReducer.js", "history", history);
      return {
        ...state,
        key: action.key,
        public_key: action.public_key,
        private_key: action.private_key,
        history: history.reverse(),
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
      const transactions = [];
      action.chain.forEach((block) => {
        block.transactions.forEach((transaction) => {
          transactions.push(transaction);
        });
      });
      if (
        state.public_key !== null &&
        state.public_key !== undefined &&
        state.public_key !== ""
      ) {
        const history = [];
        transactions.forEach((transaction) => {
          if (transaction.fromAddress === state.public_key) {
            history.push({
              type: "sent",
              to: transaction.toAddress,
              amount: transaction.amount,
              timestamp: transaction.timestamp,
            });
          }
          if (transaction.toAddress === state.public_key) {
            history.push({
              type: "received",
              from: transaction.fromAddress,
              amount: transaction.amount,
              timestamp: transaction.timestamp,
            });
          }
        });

        console.log("src/AppReducer.js", "History", history);
        return {
          ...state,
          history: history.reverse(),
          transactions: transactions.reverse(),
          chain: action.chain,
        };
      } else {
        console.log("src/AppReducer.js", "transaction", transactions);
        return {
          ...state,
          transactions: transactions.reverse(),
          chain: action.chain,
        };
      }

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
