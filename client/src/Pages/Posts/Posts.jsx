import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
// import { handleServerRequest } from "../../utils";
import "../../css/Posts.css";
import SearchBar from "../../components/SearchBar";

function Posts() {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPosts, setNumPosts] = useState(0);
  const [currentUser] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState(null);
  const [searchRes, setSearchRes] = useState(null);
  const [toggleNewPost, setToggleNewPost] = useState(false);
  const postTitle = useRef(`title`);
  const postBody = useRef(`body`);
  const navigate = useNavigate();

  useEffect(() => {
    async function getNumPosts() {
      const response = await fetch(`http://localhost:3000/post/count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          token: currentUser.token,
        }),
      });
      const data = await response.json();
      console.log(data);
      setNumPosts(data);
    }
    getNumPosts();
  }, [currentUser.token, currentUser.id]);

  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch(
        `http://localhost:3000/post?_page=${pageNumber}&_limit=4`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.id,
            token: currentUser.token,
          }),
        }
      );
      const data = await response.json();
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
  }, [currentUser.id, currentUser.token, pageNumber]);

  function handlePostClick(postId) {
    navigate(`${postId}`);
  }

  async function handleAddPost() {
    setToggleNewPost(false);
    const newPostInfo = {
      user_id: `${currentUser.id}`,
      title: `${postTitle.current.value}`,
      body: `${postBody.current.value}`,
    };
    const result = await fetch(`http://localhost:3000/post/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          user_id: currentUser.id,
          token: currentUser.token,
        },
        item: newPostInfo,
      }),
    });
    const data = await result.json();
    console.log(data);
    if (typeof data === "object") {
      setPosts((prev) => [...prev, data]);
    } else {
      handleErr(data);
    }
  }

  function handleErr(err) {
    switch (err) {
      case 1:
        setErr({ message: "your request was denied" });
        break;
      case 2:
        setPosts([]);
        break;
      case 3:
        setErr({ message: "something went wrong :/ please try again later." });
        break;
      case 4:
        setErr({
          message: "you are logged out. please reload and log back in.",
        });
        break;
      case 5:
        setErr({ message: "you don`t have permission to view this recourse" });
        break;
    }
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
        className="middleBtn"
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
      <button
        className="middleBtn"
        disabled={pageNumber === 1}
        onClick={() => setPageNumber((prev) => prev - 1)}
      >{`<`}</button>
      <button
        className="middleBtn"
        disabled={4 * pageNumber >= numPosts}
        onClick={() => {
          setPageNumber((prev) => prev + 1);
        }}
      >
        {`>`}
      </button>
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
                    <div>{post.username}</div>
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
