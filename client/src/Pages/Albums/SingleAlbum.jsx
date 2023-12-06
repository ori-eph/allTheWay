import { Link, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleServerRequest } from "../../utils";

function SingleAlbum() {
  // const [currentUser] = useOutletContext();
  const [photos, setPhotos] = useState([]);
  const { albumId } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [err, setErr] = useState(null);
  const [numberOfPhotos, setNumberOfPhotos] = useState(0);

  useEffect(() => {
    async function getNumberOfPhotos() {
      const response = await fetch(
        `http://localhost:3000/albums/${albumId}/photos?_page=1&_limit=3`
      );
      const data = response.headers.get("x-total-count");
      setNumberOfPhotos(data);
    }
    getNumberOfPhotos();
  }, [albumId]);

  useEffect(() => {
    async function getAlbum() {
      const response = await handleServerRequest(
        `http://localhost:3000/albums/${albumId}/photos?_page=${pageNumber}&_limit=3`
      );
      setPhotos(response);
    }

    async function handleAlbum() {
      setErr(null);
      try {
        getAlbum();
      } catch (err) {
        setErr(err);
      } finally {
        // console.log(post);
      }
    }

    handleAlbum();
  }, [albumId, pageNumber]);

  return (
    <>
      <Link to="/home/albums">
        <img
          src="../../../public/back-icon.png"
          alt="back button"
          id="back-icon"
        />
      </Link>
      <h1 style={{ textAlign: "center" }}>album id: {albumId}</h1>
      <div id="photos-container">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
        >{`<`}</button>
        {photos.map((photo) => {
          return (
            <figure className="photo-container" key={photo.id}>
              <img src={photo.thumbnailUrl} alt={photo.title} />
              <figcaption> {photo.title} </figcaption>
            </figure>
          );
        })}
        <button
          disabled={3 * pageNumber >= numberOfPhotos}
          onClick={() => {
            setPageNumber((prev) => prev + 1);
          }}
        >
          {`>`}
        </button>
      </div>
    </>
  );
}

export default SingleAlbum;
