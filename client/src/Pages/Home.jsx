import { useOutletContext } from "react-router-dom";

function Home() {
  const [currentUser, setCurrentUser] = useOutletContext();
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome, {currentUser.name} </h1>
    </>
  );
}

export default Home;
