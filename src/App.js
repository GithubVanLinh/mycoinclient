import logo from "./logo.svg";
import "./App.css";
// import { WebSocket } from "ws";
import { useContext, useEffect, useReducer, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AppContext from "./AppContext";
import AppReducer from "./AppReducer";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import WalletUtil from "./util/wallet";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Block from "./Block";
import Header from "./Header";
import {
  Transaction,
  ReceiveTransaction,
  SendTransaction,
} from "./Transaction";

function App() {
  const URL = "ws://localhost:9000";
  const navigator = useNavigate();

  useContext(AppContext);
  const ws = new WebSocket(URL);
  const reducerInititalState = {
    chain: [],
    key: null,
    ws: ws,
    wallet: null,
    public_key: null,
    private_key: null,
    transactions: [],
  };

  const [state, dispatch] = useReducer(AppReducer, reducerInititalState);

  const handleIncommingMessage = (message) => {
    switch (message.type) {
      case "chain":
        console.log("src/App.js", "Receive new chain...", message.chain);
        dispatch({ type: "request-chain", chain: message.chain });
        break;
      case "key":
        dispatch({
          type: "set_key",
          key: message.key,
        });
        break;
      case "balance":
        dispatch({
          type: "set_balance",
          balance: message.balance,
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    state.ws.onopen = () => {
      console.log("WebSocket Connected");
      console.log("Requesting Chain");
      state.ws.send(JSON.stringify({ type: "request-chain" }));
    };

    state.ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      handleIncommingMessage(message);
    };

    return () => {
      state.ws.onclose = () => {
        console.log("WebSocket Disconnected");
        dispatch({ type: "set_ws", ws: new WebSocket(URL) });
      };
    };
  }, []);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Routes>
        <Route
          path="/"
          element={
            <UnAuthenticatedRoute>
              <HomePage />
            </UnAuthenticatedRoute>
          }
        />
        <Route
          path="/create-wallet"
          element={
            <UnAuthenticatedRoute>
              <CreateWalletPage />
            </UnAuthenticatedRoute>
          }
        />
        <Route
          path="/access-wallet"
          element={
            <UnAuthenticatedRoute>
              <AccessWalletPage />
            </UnAuthenticatedRoute>
          }
        />
        <Route path="/blocks" element={<BlockPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

const HomePage = () => {
  const { state, dispatch } = useContext(AppContext);

  console.log("src/App.js", "state", state);

  return (
    <Container>
      {getHeader()}

      {getFooter()}
    </Container>
  );

  function getHeader() {
    return (
      <Col>
        <Row style={{ background: "lightblue", height: "100vh" }}>
          <Col>
            <Row style={{ height: "20%" }}>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                }}
              >
                <Title title="MyCOIN" />
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "start",
                }}
              >
                <Header />
              </Col>
            </Row>
            <Row style={{ height: "80%" }}>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Link to="/create-wallet">
                      <Button>Create Wallet</Button>
                    </Link>
                    <Link to="/access-wallet">
                      <Button>Access Wallet</Button>
                    </Link>
                  </Col>
                </Row>
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                This is AMAZING COIN
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    );
  }

  function getFooter() {
    return (
      <div>
        <h1>Footer</h1>
      </div>
    );
  }
};

const Title = ({ title }) => {
  return (
    <div>
      <h1 style={{ color: "white" }}>{title}</h1>
    </div>
  );
};

const Dashboard = () => {
  const { state, dispatch } = useContext(AppContext);

  const [pageState, setPageState] = useState({
    buyModel: {
      show: false,
      numberBuy: 0,
    },
    sendModel: {
      show: false,
      from: state.public_key,
      to: "",
      amount: 0,
    },
  });

  useEffect(() => {
    console.log("src/App.js", "state", state);
    // get balance
    state.ws.send(
      JSON.stringify({ type: "request-balance", public_key: state.public_key })
    );
  }, [state.chain]);

  const handleBuyModelClose = () => {
    setPageState({ ...pageState, buyModel: { show: false } });
  };
  const handleBuyModelShow = () =>
    setPageState({ ...pageState, buyModel: { show: true } });
  const handleOnBuyNumberChange = (e) => {
    console.log("src/App.js", "value", e.target.value);
    setPageState({
      ...pageState,
      buyModel: {
        ...pageState.buyModel,
        numberBuy: e.target.value,
      },
    });
  };

  const handleBuyOnClick = () => {
    state.ws.send(
      JSON.stringify({
        type: "buy",
        public_key: state.public_key,
        amount: +pageState.buyModel.numberBuy,
      })
    );
    handleBuyModelClose();
  };

  const handleToChange = (e) => {
    setPageState({
      ...pageState,
      sendModel: {
        ...pageState.sendModel,
        to: e.target.value,
      },
    });
  };

  const handleAmountSendChange = (e) => {
    setPageState({
      ...pageState,
      sendModel: {
        ...pageState.sendModel,
        amount: e.target.value,
      },
    });
  };

  const handleSendModelClose = () => {
    setPageState({
      ...pageState,
      sendModel: {
        ...pageState.sendModel,
        show: false,
      },
    });
  };

  const handleSendModelShow = () =>
    setPageState({
      ...pageState,
      sendModel: {
        ...pageState.sendModel,
        show: true,
      },
    });

  const handleSendOnClick = () => {
    state.ws.send(
      JSON.stringify({
        type: "send",
        from: state.public_key,
        private_key: state.private_key,
        to: pageState.sendModel.to,
        amount: +pageState.sendModel.amount,
      })
    );
    handleSendModelClose();
  };

  return (
    <div style={{ padding: "0px 12px" }}>
      <Row>
        <Col xs={3} style={{ background: "lightblue" }}>
          <Row>
            <Col>
              <h1
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                MyCOIN
              </h1>
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={9}>
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        overflowWrap: "normal",
                      }}
                    >
                      {state.public_key}
                    </div>
                  </Col>
                  <Col xs={3}>
                    <CopyToClipboard text={state.public_key}>
                      <Button>COPY</Button>
                    </CopyToClipboard>
                  </Col>
                </Row>
              </CardHeader>
              <Card.Body style={{ textAlign: "center" }}>
                {state.balance}
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <Button onClick={handleBuyModelShow}>Buy</Button>
              <Button onClick={handleSendModelShow}>Send</Button>
              <Modal
                show={pageState.buyModel.show}
                onHide={handleBuyModelClose}
              >
                <Modal.Header>
                  <Modal.Title>Buy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="number"
                    value={pageState.buyModel.numberBuy}
                    onChange={handleOnBuyNumberChange}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleBuyModelClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleBuyOnClick}>
                    Buy
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={pageState.sendModel.show}
                onHide={handleBuyModelClose}
              >
                <Modal.Header>
                  <Modal.Title>Send</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    type="text"
                    value={pageState.sendModel.to}
                    placeholder="To"
                    onChange={handleToChange}
                  />
                  <input
                    type="number"
                    value={pageState.sendModel.amount}
                    onChange={handleAmountSendChange}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleSendModelClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSendOnClick}>
                    Send
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
          <Row></Row>
        </Col>
        <Col xs={9} style={{ background: "lightgray" }}>
          <Row>
            <Col xs={6}>
              <h1 style={{ textAlign: "center" }}>Sent</h1>
              {state.history
                .filter((transation) => transation.type === "sent")
                .map((transaction, id) => (
                  <SendTransaction
                    amount={transaction.amount}
                    to={transaction.to}
                    key={id}
                  ></SendTransaction>
                ))}
            </Col>
            <Col xs={6}>
              <h1 style={{ textAlign: "center" }}>Received</h1>
              {state.history
                .filter((transation) => transation.type === "received")
                .map((transaction, id) => (
                  <ReceiveTransaction
                    amount={transaction.amount}
                    from={transaction.from}
                    key={id}
                  ></ReceiveTransaction>
                ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const CreateWalletPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigator = useNavigate();

  console.log("state", state);

  const onGenerateWallet = () => {
    // make text file and send it to user
    console.log("generate wallet...");
    state.ws.send(JSON.stringify({ type: "generate-wallet" }));
  };

  const downloadWallet = () => {
    // make text file and send it to user
    if (state.key) {
      const keyFile = new Blob([JSON.stringify(state.key)], {
        type: "text/plain",
      });

      const downloadLink = document.createElement("a");
      downloadLink.download = "key.json";
      downloadLink.href = URL.createObjectURL(keyFile);
      downloadLink.click();
      navigator("/access-wallet");
    }
  };

  return (
    <Container>
      <Row>
        <Link to="/">Home</Link>
      </Row>
      <Row>
        <Col>
          <Button onClick={onGenerateWallet}>
            <a download="abc">Generate</a>
          </Button>
          {state.key && <Button onClick={downloadWallet}>Download</Button>}
        </Col>
      </Row>
    </Container>
  );
};

const AccessWalletPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const navigator = useNavigate();

  const onAccessWallet = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const w = JSON.parse(e.target.result);
      dispatch({
        type: "set_keys",
        key: JSON.stringify(w),
        public_key: w.public_key,
        private_key: w.private_key,
      });
      navigator("/dashboard");
    };
    reader.readAsText(file);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Container>
      <Row>
        <Link to="/">Home</Link>
      </Row>
      <Row>
        <Col>
          <input type="file" onChange={onFileChange} />
          <Button onClick={onAccessWallet}>Access</Button>
        </Col>
      </Row>
    </Container>
  );
};

const BlockPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const blocks = state.chain.reverse();
  if (!blocks || blocks.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <Container style={{ background: "lightgrey" }}>
      <Header />
      {blocks.map((block, id) => (
        <Block key={id} block={block} />
      ))}
    </Container>
  );
};

const TransactionsPage = () => {
  const { state, dispatch } = useContext(AppContext);
  if (!state.transactions || state.transactions.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <Container style={{ background: "lightgrey" }}>
      <Header />
      {state.transactions.map((transaction, id) => (
        <Transaction
          key={id}
          amount={transaction.amount}
          from={
            transaction.fromAddress
              ? transaction.fromAddress.toString()
              : "System"
          }
          to={JSON.stringify(transaction.toAddress)}
        />
      ))}
    </Container>
  );
};

const AuthenticatedRoute = ({ children }) => {
  const { state, dispatch } = useContext(AppContext);

  return state.public_key ? children : <Navigate to="/access-wallet" />;
};

const UnAuthenticatedRoute = ({ children, ...rest }) => {
  const { state, dispatch } = useContext(AppContext);
  return state.public_key ? <Navigate to="/dashboard" /> : children;
};

export default App;
