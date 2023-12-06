import SearchBar from "../../components/SearchBar";
import { useState, useEffect } from "react";
import { handleServerRequest } from "../../utils";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import "../../css/Albums.css";

function Albums() {
  const [searchRes, setSearchRes] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [err, setErr] = useState(null);
  const [currentUser] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getAlbums = async () => {
      const response = await handleServerRequest(
        `http://localhost:3000/users/${currentUser.id}/albums`
      );
      const data = await response;
      setAlbums(data);
    };

    async function handleAlbums() {
      setErr(null);
      try {
        getAlbums();
      } catch (err) {
        setErr(err);
      }
    }

    handleAlbums();
  }, [currentUser.id]);

  function handlealbumClick(albumId) {
    navigate(`${albumId}`);
  }

  const filteredAlbums = searchRes
    ? albums.filter((item) => searchRes.includes(item.id))
    : albums;

  return (
    <>
      <SearchBar
        searchBy={["title", "id"]}
        category={"posts"}
        setErr={setErr}
        setResList={setSearchRes}
        list={albums}
      />
      {err && <p>{err.message}</p>}
      <div id="albums-container">
        {albums.length ? (
          filteredAlbums.map((album, index) => {
            return (
              <div
                className="album-container"
                key={index}
                onClick={() => handlealbumClick(album.id)}
              >
                <div className="album-icon">
                  <img
                    className="profile-picture"
                    src="../../../public/album-icon.png"
                    alt="album icon"
                  />
                </div>
                <div className="album-title">{album.title} </div>
                <div className="album-id"> {album.id}</div>
              </div>
            );
          })
        ) : albums.length === 0 ? (
          <span>You have no albums yet</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
      <Outlet />
    </>
  );
}
export default Albums;
