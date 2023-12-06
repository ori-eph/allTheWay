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
      const response = await handleServerRequest(
        `http://localhost:3000/posts/${postId}`
      );
      //   console.log(
      //     `response: ${JSON.stringify(response)}, length: ${response.length} `
      //   );
      if (!JSON.stringify(response).length) {
        throw new Error("the post was not found");
      } else {
        const data = await response;
        setPost(data);
      }
    }

    async function handlePost() {
      setErr(null);
      try {
        getPost();
      } catch (err) {
        setErr(err);
      } finally {
        // console.log(post);
      }
    }

    handlePost();
  }, [postId]);

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
            <div> {currentUser.name} </div>
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
      postId: `${postId}`,
      name: `${currentUser.name}`,
      email: `${currentUser.email}`,
      body: `${commentBody.current.value}`,
    };
    const result = await fetch(
      `http://localhost:3000/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentInfo),
      }
    );
    const data = await result.json();
    setComments((prev) => [...prev, data]);
  }

  return (
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
            {/* <div>id: {post?.id}</div> */}
            <div className="poster-info">
              <div>{currentUser.username}</div>
              <div>{currentUser.name}</div>
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
          />
        )}
      </div>
    </>
  );
}

export default SinglePost;
