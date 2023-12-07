import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleServerRequest } from "../utils";
// import "../css/signInSignUp.css";

function Login() {
  const [err, setErr] = useState(null);
  const [formStatus, setFormStatus] = useState("typing");
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("currentUser");
  }, []);

  // Function to validate start info
  async function handleLogin(e) {
    e.preventDefault();
    setErr(null);
    setFormStatus("loading");
    try {
      const foundUser = await fetch(`http://localhost:3000/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password,
        }),
      });
      const response = await foundUser.json();
      console.log("response --->", response);
      if (typeof response === "object") {
        setFormStatus("sent");
        localStorage.setItem("currentUser", JSON.stringify(response[0]));
        navigate("/home");
      } else {
        switch (response) {
          case 1:
            console.log("invalid inputs");
            break;
          case 2:
            console.log("user does not exist");
            throw Error("username or password not correct");
            break;
          case 3:
            console.log("somthing went wrong with the server");
            break;
          default:
            console.log("somthing went wrong with the server");
            break;
        }
      }
    } catch (err) {
      setFormStatus("error");
      setErr(err);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  return (
    <main id="login">
      <h2>Login</h2>
      <form>
        <label htmlFor="username">username</label>
        <input
          id="username"
          type="text"
          name="username"
          onChange={handleInputChange}
        />
        <label htmlFor="password">password</label>
        <input
          name="password"
          id="password"
          type="password"
          onChange={handleInputChange}
        />
        <button
          onClick={(e) => {
            handleLogin(e);
          }}
        >
          Login
        </button>
      </form>
      {formStatus !== "typing" && (
        <p>{formStatus === "sent" ? "sent" : err?.message || "loading..."}</p>
      )}
    </main>
  );
}

export default Login;
