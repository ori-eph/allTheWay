import { useEffect, useRef, useState } from "react";
import TodoItem from "./TodoItem";
import SearchBar from "../../components/SearchBar";
import { handleServerRequest } from "../../utils";
import "../../css/ToDo.css";
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
      return await handleServerRequest(
        `http://localhost:3000/users/${currentUser.id}/todos`
      );
    }

    async function makeList() {
      try {
        const listTemp = await getUserList();

        setList(listTemp);
      } catch (err) {
        setErr(err);
      }
    }

    makeList();
  }, [currentUser.id]);

  async function handleRemoveItem(index, id) {
    setList((prev) => {
      return prev.filter((item, i) => i !== index);
    });
    try {
      await handleServerRequest(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
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

  async function addItem(e) {
    e.preventDefault();
    if (!newItem) {
      return;
    }
    const newItemObj = {
      title: newItem,
      userId: currentUser.id,
      completed: false,
    };
    setNewItem("");
    try {
      const savedItem = await handleServerRequest(
        "http://localhost:3000/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItemObj),
        }
      );
      setList((prev) => [...prev, savedItem]);
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
