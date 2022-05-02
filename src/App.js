import logo from "./logo.svg";
import "./App.css";
// import { WebSocket } from "ws";
import { useContext, useEffect, useReducer, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AppContext from "./AppContext";
import AppReducer from "./AppReducer";
import { Button, Col, Container, Row } from "react-bootstrap";

function App() {
  const [message, setMessage] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const URL = "ws://localhost:9000";

  useContext(AppContext);
  const ws = new WebSocket(URL);
  const reducerInititalState = {
    chain: [],
    key: null,
    ws: ws,
  };

  const [state, dispatch] = useReducer(AppReducer, reducerInititalState);

  const sendMessageToServer = () => {
    console.log("src/App.js", "send message", sendMessage);
    state.ws.send(JSON.stringify(JSON.parse(sendMessage)));
  };

  const handleIncommingMessage = (message) => {
    switch (message.type) {
      case "chain":
        setMessage(JSON.stringify(message.chain));
        dispatch({ type: "request-chain", chain: message.chain });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    state.ws.onopen = () => {
      console.log("WebSocket Connected");
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
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/create-wallet" element={<CreateWalletPage />}></Route>
        <Route path="/access-wallet" element={<AccessWalletPage />}></Route>
        <Route path="/chain" element={<ChainPage />}></Route>
        <Route path="/test" element={<TestPage />}></Route>
      </Routes>
    </AppContext.Provider>
  );
}

const HomePage = () => {
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

const TestPage = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="App">
      <header className="App-header">
        <p>{JSON.stringify(state.chain)}</p>
      </header>
    </div>
  );
};

const CreateWalletPage = () => {
  const { state, dispatch } = useContext(AppContext);
  return <div className="App">Create</div>;
};

const AccessWalletPage = () => {
  const { state, dispatch } = useContext(AppContext);
  return <div>Access</div>;
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

export default App;
