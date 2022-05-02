import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Container>
      <Link to="/">Home</Link>
      <Link to="/blocks">Blocks</Link>
      <Link to="/transactions">Transactions</Link>
    </Container>
  );
}

export default Header;
