import logo from "./logo.svg";
import "./App.css";
// import { WebSocket } from "ws";
import { useContext, useEffect, useReducer, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AppContext from "./AppContext";
import AppReducer from "./AppReducer";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import WalletUtil from "./util/wallet";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { CopyToClipboard } from "react-copy-to-clipboard";

function App() {
  const [message, setMessage] = useState("");
  const [sendMessage, setSendMessage] = useState("");
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
  };

  const [state, dispatch] = useReducer(AppReducer, reducerInititalState);

  const handleIncommingMessage = (message) => {
    switch (message.type) {
      case "chain":
        setMessage(JSON.stringify(message.chain));
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
        <Route path="/chain" element={<ChainPage />} />
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
                <Link to="/chain" style={{ color: "white" }}>
                  Blocks
                </Link>
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

  useEffect(() => {
    console.log("src/App.js", "state", state);
    // get balance
    state.ws.send(
      JSON.stringify({ type: "request-balance", public_key: state.public_key })
    );
  }, []);

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
              <Button>Buy</Button>
              <Button>Send</Button>
            </Col>
          </Row>
          <Row></Row>
        </Col>
        <Col xs={9} style={{ background: "lightgray" }}>
          Content
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

const ChainPage = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="App">
      <header className="App-header">
        <p>{JSON.stringify(state.chain)}</p>
      </header>
    </div>
  );
};

const AuthenticatedRoute = ({ children }) => {
  const { state, dispatch } = useContext(AppContext);

  return state.key ? children : <Navigate to="/access-wallet" />;
};

const UnAuthenticatedRoute = ({ children, ...rest }) => {
  const { state, dispatch } = useContext(AppContext);
  return state.key ? <Navigate to="/dashboard" /> : children;
};

export default App;
