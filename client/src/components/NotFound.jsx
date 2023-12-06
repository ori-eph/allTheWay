import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{ backgroundColor: "white", textAlign: "center", margin: "auto" }}
    >
      <h1>404 NOT FOUND</h1>
      <p>
        we apologize, the page you are trying to reach is currently unavailable
        :/ <br /> how about you try looking at other parts of our site?
      </p>
      <Link to="/home">Back to Home page</Link>
    </div>
  );
}

export default NotFound;
