import { Card } from "react-bootstrap";

function Block({ block }) {
  const {
    index,
    timestamp,
    transactions,
    previousHash,
    hash,
    nonce,
    difficulty,
  } = block;
  console.log("src/Block.js", "Block", block);
  return (
    <Card>
      <Card.Body>
        <h1>Block {index}</h1>
        <p>Timestamp: {timestamp}</p>
        <p>Transactions:</p>
        <ul>
          {transactions.map((transaction, id) => (
            <li key={id}>
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  overflowWrap: "normal",
                }}
              >
                From:{" "}
                {transaction.fromAddress
                  ? transaction.fromAddress.toString()
                  : "System"}
              </div>
              <div
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  overflowWrap: "normal",
                }}
              >
                To: {transaction.toAddress.toString()}
              </div>
              <div>Amount: {transaction.amount}</div>
            </li>
          ))}
        </ul>
        <p
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            overflowWrap: "normal",
          }}
        >
          Previous Hash: {previousHash}
        </p>
        <p
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            overflowWrap: "normal",
          }}
        >
          Hash: {hash}
        </p>
        <p>Nonce: {nonce}</p>
        <p>Difficulty: {difficulty}</p>
      </Card.Body>
    </Card>
  );
}

export default Block;
