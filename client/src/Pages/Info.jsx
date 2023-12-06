import { useOutletContext } from "react-router-dom";
import "../css/Info.css";

function Info() {
  const [currentUser] = useOutletContext();

  const renderUserDetail = (user) => {
    return (
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.phone && (
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
        )}
        {user.address && (
          <p>
            <strong>Address: </strong>
            {user.address?.city}
          </p>
        )}
        <p>
          <strong>Website:</strong> {user.website}
        </p>
      </div>
    );
  };

  return (
    <div id="userInfo">
      <h1>your info</h1>
      {currentUser && renderUserDetail(currentUser)}
    </div>
  );
}

export default Info;
