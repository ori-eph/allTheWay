import { useEffect, useRef, useState } from "react";
import TodoItem from "./TodoItem";
import SearchBar from "../../components/SearchBar";
import { handleServerRequest } from "../../utils";
// import "../../css/ToDo.css";
import { useOutletContext } from "react-router-dom";

function ToDoList() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState(null);
  const [searchRes, setSearchRes] = useState(null);
  const [newItem, setNewItem] = useState("");
  const sortOrderRef = useRef("date");
  const [currentUser] = useOutletContext();

  useEffect(() => {
    async function getUserList() {
      return await fetch(`http://localhost:3000/todo/${currentUser.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: currentUser.token,
          user_id: currentUser.id,
        }),
      });
    }

    async function makeList() {
      try {
        const listTemp = await getUserList();
        const response = await listTemp.json();
        console.log(response);
        if (response) {
          if (typeof response === "object") {
            setList(response);
          } else {
            switch (response) {
              case 1:
                console.log("something went wrong with the server");
                break;
              case 2:
                console.log("todo not found");
                break;
              case 3:
                console.log("something went wrong with the server");
                break;
              case 4:
                console.log("no permission");
                break;
              case 5:
                console.log("no permission");
                break;
            }
          }
        } else {
          console.log("response is not defined");
        }
      } catch (err) {
        setErr(err);
      }
    }
    console.log("List --->", list);
    makeList();
  }, [currentUser.id]);

  async function handleRemoveItem(index, id) {
    try {
      const deletedTodo = await fetch(`http://localhost:3000/todo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: currentUser.token,
          user_id: currentUser.id,
        }),
      });
      const response = await deletedTodo.json();
      if (response) {
        if (typeof response === "object") {
          setList((prev) => {
            return prev.filter((item, i) => i !== index);
          });
        } else {
          switch (response) {
            case 1:
              console.log("something went wrong with the server");
              break;
            case 2:
              console.log("todo not found");
              break;
            case 3:
              console.log("something went wrong with the server");
              break;
            case 4:
              console.log("no permission");
              break;
            case 5:
              console.log("no permission");
              break;
          }
        }
      } else {
        console.log("response is not defined");
      }
    } catch (err) {
      setErr(err);
    }
  }

  function handleCheckItem(id) {
    setList((prev) => {
      const updatedList = prev.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        } else {
          return item;
        }
      });
      handleSortChange(updatedList);
      return updatedList;
    });
  }

  function handleSortChange(listToSort) {
    const order = sortOrderRef.current.value;
    let sortedList = Array.isArray(listToSort) ? [...listToSort] : [...list];

    if (order === "A-Z") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (order === "Z-A") {
      sortedList.sort((a, b) => b.title.localeCompare(a.title));
    } else if (order === "date") {
      sortedList.sort((a, b) => a.id - b.id);
    } else if (order === "importance") {
      sortedList.sort((a, b) => a.completed - b.completed);
    }

    setList(sortedList);
  }

  // ... (other code remains unchanged)

  async function addItem(e) {
    e.preventDefault();
    if (!newItem) {
      return;
    }
    const newItemObj = {
      user: { user_id: currentUser.user_id, token: currentUser.token },
      item: { title: newItem, completed: 0 },
    };
    setNewItem("");
    try {
      const savedItem = await fetch("http://localhost:3000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemObj),
      });
      const response = await savedItem.json();
      if (response) {
        if (typeof response === "object") {
          setList((prev) => [...prev, savedItem]);
        } else {
          switch (response) {
            case 1:
              console.log("something went wrong with the server");
              break;
            case 2:
              console.log("todo not found");
              break;
            case 3:
              console.log("something went wrong with the server");
              break;
            case 4:
              console.log("no permission");
              break;
            case 5:
              console.log("no permission");
              break;
          }
        }
      } else {
        console.log("response is not defined");
      }
    } catch (err) {
      setErr(err);
    }
  }

  function getList() {
    let filteredList = searchRes
      ? list.filter((item) => searchRes.includes(item.id))
      : list;
    const listJsx = filteredList.map((item, index) => {
      return (
        <li key={item.id}>
          {
            <TodoItem
              err={err}
              item={item}
              removeItem={() => {
                handleRemoveItem(index, item.id);
              }}
              checkItem={() => handleCheckItem(item.id)}
              currentUser={currentUser}
            />
          }
        </li>
      );
    });
    return listJsx;
  }

  const presentedList = getList();

  return (
    <>
      <h1>Your to do list</h1>
      <div id="list-functions-container">
        <form id="addItemForm" onSubmit={addItem}>
          <label htmlFor="item">add an item:</label>
          <input
            name="item"
            type="text"
            placeholder="item..."
            value={newItem}
            onChange={(e) => {
              setNewItem(e.target.value);
            }}
          />
          <button id="addItemBtn">+</button>
        </form>
        <SearchBar
          searchBy={["title", "id"]}
          category={"todos"}
          setErr={setErr}
          setResList={setSearchRes}
          list={list}
        />
        <label htmlFor="sortOrder">Sort by: </label>
        <select ref={sortOrderRef} id="sortOrder" onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="importance">importance</option>
        </select>
      </div>
      {err && <p>{err.message}</p>}
      {list.length > 0 ? (
        <ol id="toDoList">{presentedList}</ol>
      ) : (
        <p id="emptyToDo">your list is empty.</p>
      )}
    </>
  );
}

export default ToDoList;
