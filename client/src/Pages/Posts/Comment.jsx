import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

function Comment(props) {
  const [currentUser] = useOutletContext();
  const [toggleEditMode, setToggleEditMode] = useState(false);
  const [comment, setComment] = useState({
    postId: props.postId,
    id: props.id,
    name: props.name,
    email: props.email,
    body: props.body,
  });
  const bodyInput = useRef(props.body);

  function handleEditComment() {
    fetch(`http://localhost:3000/comments/${props.id}`, {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      body: JSON.stringify({ body: bodyInput.current.value }),
    });
    setComment((prev) => {
      return { ...prev, body: bodyInput.current.value };
    });
    setToggleEditMode(false);
  }

  return (
    <div className="comment-container" key={comment.index}>
      <div>
        <div className="comment-header">
          <img
            src="../../../public/profile.jpg"
            alt="profile picture"
            className="profile-picture"
          />
          <div className="poster-info">
            <div className="commentName"> {comment.name} </div>
            <div className="commentEmail"> {comment.email} </div>
          </div>
        </div>
        {!toggleEditMode ? (
          <div className="commentBody"> {comment.body} </div>
        ) : (
          <form>
            <label htmlFor="body">body</label>
            <input type="text" name="commentBody" id="body" ref={bodyInput} />
            <button
              type="button"
              className="check-button"
              onClick={handleEditComment}
            >
              <img
                src="../../../public/check-icon.png"
                alt="check icon"
                className="check-icon"
              />
            </button>
            <button
              type="button"
              className="x-button"
              onClick={() => setToggleEditMode(false)}
            >
              <img
                src="../../../public/x-icon.png"
                alt="x icon"
                className="x-icon"
              />
            </button>
          </form>
        )}
      </div>
      <div className="commentButtons">
        <button
          className="trash-button"
          onClick={() => props.handleRemoveComment(comment.id)}
        >
          <img
            src="../../../public/trash-icon.png"
            alt="trash icon"
            className="trash-icon"
          />
        </button>
        {comment.email === currentUser.email && (
          <button
            className="edit-button"
            onClick={() => setToggleEditMode(true)}
          >
            <img
              src="../../../public/edit-icon.png"
              alt="edit icon"
              className="edit-icon"
            />
          </button>
        )}
      </div>
      <span className="commentId">{comment.id}</span>
    </div>
  );
}

export default Comment;
