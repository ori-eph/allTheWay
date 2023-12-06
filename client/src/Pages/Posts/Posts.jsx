import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { handleServerRequest } from "../../utils";
import "../../css/Posts.css";
import SearchBar from "../../components/SearchBar";

function Posts() {
  const [currentUser] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState(null);
  const [searchRes, setSearchRes] = useState(null);
  const [toggleNewPost, setToggleNewPost] = useState(false);
  const postTitle = useRef(`title`);
  const postBody = useRef(`body`);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      const response = await handleServerRequest(
        `http://localhost:3000/users/${currentUser.id}/posts`
      );
      const data = await response;
      setPosts(data);
    };

    async function handlePosts() {
      setErr(null);
      try {
        getPosts();
      } catch (err) {
        setErr(err);
      }
    }

    handlePosts();
  }, [currentUser.id]);

  function handlePostClick(postId) {
    navigate(`${postId}`);
  }

  async function handleAddPost() {
    setToggleNewPost(false);
    const newPostInfo = {
      userId: `${currentUser.id}`,
      title: `${postTitle.current.value}`,
      body: `${postBody.current.value}`,
    };
    const result = await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPostInfo),
    });
    const data = await result.json();
    setPosts((prev) => [...prev, data]);
  }

  const filteredPosts = searchRes
    ? posts.filter((item) => searchRes.includes(item.id))
    : posts;

  return (
    <div>
      <h1 id="postsTitle">Your posts</h1>
      <SearchBar
        searchBy={["title", "id"]}
        category={"posts"}
        setErr={setErr}
        setResList={setSearchRes}
        list={posts}
      />
      {err && <p>{err.message}</p>}
      <button
        id="new-post-button"
        onClick={() => setToggleNewPost((prev) => !prev)}
      >
        Add new post
      </button>
      {toggleNewPost && (
        <div className="single-post-container" id="add-new-post">
          <div className="post-header">
            <img
              className="profile-picture"
              src="../../../public/profile.jpg"
              alt="profile picture"
            />
            <div className="poster-info">
              <div>{currentUser.username}</div>
              <div>{currentUser.name}</div>
            </div>
          </div>
          <div className="single-post-content">
            <div>
              <input
                type="text"
                ref={postTitle}
                placeholder="title"
                className="post-title"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="body"
                ref={postBody}
                className="post-body"
              />
            </div>
          </div>
          <div id="button-container">
            <button type="button" id="post-button" onClick={handleAddPost}>
              Post
            </button>
          </div>
        </div>
      )}
      <div id="posts-container">
        {posts.length ? (
          filteredPosts.map((post, index) => {
            return (
              <div
                className="post-container"
                key={index}
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-header">
                  <img
                    className="profile-picture"
                    src="../../../public/profile.jpg"
                    alt="profile picture"
                  />
                  <div className="poster-info">
                    <div>{currentUser.username} </div>
                    <div>{currentUser.name} </div>
                  </div>
                </div>
                <div className="post-content">
                  <div className="postTitle">{post.title}</div>
                  <div className="postId">{post.id}</div>
                </div>
              </div>
            );
          })
        ) : posts.length === 0 ? (
          <span>You have no posts yet</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default Posts;
