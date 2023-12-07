import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import { handleServerRequest } from "../../utils";
import Comments from "./Comments";

function SinglePost() {
  const [currentUser] = useOutletContext();
  const [comments, setComments] = useState([]);
  const [toggleComments, setToggleComments] = useState(false);
  const [post, setPost] = useState({});
  const [err, setErr] = useState(null);
  const [toggleNewCommentForm, setToggleNewCommentForm] = useState(false);
  const commentBody = useRef(null);
  const { postId } = useParams();

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`http://localhost:3000/post/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          token: currentUser.token,
        }),
      });
      const data = await response.json();
      if (typeof data != "object") {
        handleErr(data);
      } else {
        setPost(data);
      }
    }

    async function handlePost() {
      setErr(null);
      try {
        getPost();
      } catch (err) {
        handleErr(err);
      }
    }

    handlePost();
  }, [postId]);

  function handleErr(err) {
    switch (err) {
      case 1:
        setErr({ message: "your request was denied" });
        break;
      case 2:
        setErr({ message: "the item was not found." });
        break;
      case 3:
        setErr({
          message: "something went wrong :/ please try again later.",
        });
        break;
      case 4:
        setErr({
          message: "you are logged out. please reload and log back in.",
        });
        break;
      case 5:
        setErr({
          message: "you don`t have permission to view this recourse",
        });
        break;
    }
  }

  function enterCommentDetails() {
    if (!toggleNewCommentForm) {
      return <div></div>;
    }
    return (
      <div id="new-comment-container">
        <div className="commenter-info">
          <img
            className="profile-picture"
            src="../../../public/profile.jpg"
            alt="profile picture"
          />
          <div>
            <div> {currentUser.username} </div>
            <div> {currentUser.email} </div>
          </div>
        </div>

        <form id="new-comment-form">
          <label htmlFor="newCommentBody"></label>
          <input
            id="newCommentBody"
            name="newCommentBody"
            type="text"
            ref={commentBody}
          />
          <button id="send-button" type="button" onClick={handleAddComment}>
            <img
              src="../../../public/send-icon.png"
              alt="send icon"
              id="send-icon"
            />
          </button>
        </form>
      </div>
    );
  }

  async function handleAddComment() {
    setToggleNewCommentForm(false);
    const newCommentInfo = {
      post_Id: `${postId}`,
      user_id: `${currentUser.id}`,
      body: `${commentBody.current.value}`,
    };
    const result = await fetch(`http://localhost:3000/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          user_id: currentUser.id,
          token: currentUser.token,
        },
        item: newCommentInfo,
      }),
    });
    const data = await result.json();
    if (typeof data != "object") {
      handleErr(data);
    } else {
      setComments((prev) => [...prev, data]);
    }
  }

  return err ? (
    <p>{err.message}</p>
  ) : (
    <>
      <Link className="back-button" to="/home/posts">
        <img
          src="../../../public/back-icon.png"
          alt="back button"
          id="back-icon"
        />
      </Link>
      <div id="single-post-page-container">
        <div className="single-post-container">
          <div className="post-header">
            <img
              className="profile-picture"
              src="../../../public/profile.jpg"
              alt="profile picture"
            />
            <div className="poster-info">
              <div>{post?.username}</div>
            </div>
          </div>
          <div className="single-post-content">
            <div className="post-title"> {post?.title} </div>
            <div id="post-body"> {post?.body} </div>
          </div>
          <div id="buttons-container">
            <button
              id="comment-button"
              onClick={() => setToggleComments((prev) => !prev)}
            >
              <img
                id="comment-pic"
                src="../../../public/comment-icon.png"
                alt="comment icon"
              />
            </button>
            <button
              id="addComment"
              onClick={() => {
                setToggleNewCommentForm((prev) => !prev);
              }}
            >
              <img
                id="plus-icon"
                src="../../../public/plus-icon.png"
                alt="plus icon"
              />
            </button>
          </div>
        </div>
        {enterCommentDetails()}

        {toggleComments && (
          <Comments
            id="comments-container"
            comments={comments}
            setComments={setComments}
            handleErr={handleErr}
          />
        )}
      </div>
    </>
  );
}

export default SinglePost;
