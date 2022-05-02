import { Card, Col, Container, Row } from "react-bootstrap";

function Transaction({ from, to, amount }) {
  console.log("src/Transaction.js", "from", from, to, amount);
  return (
    <Card>
      <Card.Body>
        <Col>
          <Row>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                overflowWrap: "normal",
              }}
            >
              From: {from}
            </div>
            <div
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                overflowWrap: "normal",
              }}
            >
              To: {to}
            </div>
            <div>Amount: {amount}</div>
          </Row>
        </Col>
      </Card.Body>
    </Card>
  );
}

function ReceiveTransaction({ from, amount }) {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Col>
            <Row>
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  overflowWrap: "normal",
                }}
              >
                From: {from ? from : "N/A"}
              </div>
              <div>Amount: {amount}</div>
            </Row>
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
}

function SendTransaction({ to, amount }) {
  return (
    <Container>
      <Card>
        <Card.Body>
          <Col>
            <Row>
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  overflowWrap: "normal",
                }}
              >
                To: {to}
              </div>
              <div>Amount: {amount}</div>
            </Row>
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
}

export { Transaction, ReceiveTransaction, SendTransaction };
