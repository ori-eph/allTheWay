import { useRef, useState } from "react";
import { useEffect } from "react";
import { handleServerRequest } from "../../utils";
import { useOutletContext, useParams } from "react-router-dom";
import Comment from "./Comment";

function Comments({ comments, setComments, handleErr }) {
  const [err, setErr] = useState(null);
  const { postId } = useParams();
  const [currentUser] = useOutletContext();
  const setCommentsRef = useRef(setComments);
  setCommentsRef.current = setComments;

  useEffect(() => {
    async function getComments() {
      let response = await fetch(
        `http://localhost:3000/post/${postId}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.id,
            token: currentUser.token,
          }),
        }
      );
      response = await response.json();
      if (typeof response !== "object") {
        throw new Error(response);
      } else {
        setCommentsRef.current(response);
      }
    }

    async function handleComment() {
      setErr(null);
      try {
        getComments();
      } catch (err) {
        setErr(err);
      }
    }

    handleComment();
  }, [postId]);

  function handleRemoveComment(commentId) {
    fetch(`http://localhost:3000/comments/${commentId}`, { method: "DELETE" });
    setComments((prev) => [...prev].filter((item) => item.id != commentId));
  }

  return (
    <div>
      {comments.length ? (
        comments.map((comment, index) => {
          return (
            <Comment
              key={index}
              index={index}
              username={comment.username}
              email={comment.email}
              body={comment.body}
              handleRemoveComment={handleRemoveComment}
              postId={postId}
              id={comment.id}
              handleErr={handleErr}
            />
          );
        })
      ) : comments.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "3%" }}>
          You have no comments
        </p>
      ) : (
        <p style={{ textAlign: "center", marginTop: "3%" }}>Loading...</p>
      )}
    </div>
  );
}

export default Comments;
