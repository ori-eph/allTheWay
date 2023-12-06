import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import HomeLayout from "./components/HomeLayout";
import Login from "./Pages/Login";
import Info from "./Pages/Info";
import Posts from "./Pages/Posts/Posts";
import SinglePost from "./Pages/Posts/SinglePost";
import Register from "./Pages/Register";
import ToDoList from "./Pages/Todo/ToDoList";
import NotFound from "./components/NotFound";
import Albums from "./Pages/Albums/Albums";
import SingleAlbum from "./Pages/Albums/SingleAlbum";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="home" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="todos" element={<ToDoList />} />
          <Route path="posts">
            <Route index element={<Posts />} />
            <Route path=":postId" element={<SinglePost />} />
          </Route>
          <Route path="albums">
            <Route index element={<Albums />} />
            <Route path=":albumId" element={<SingleAlbum />} />
          </Route>
          <Route path="info" element={<Info />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
