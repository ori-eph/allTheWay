import { handleServerRequest } from "../../utils";
import "../../css/ToDo.css";

function TodoItem({ item, removeItem, checkItem, setErr }) {
  async function handleCheck() {
    checkItem();
    try {
      await handleServerRequest(`http://localhost:3000/todos/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed }),
      });
    } catch (err) {
      setErr(err);
    }
  }
  return (
    <>
      <div id="toDoItem">
        <h4>{item.id}</h4>
        <h2 className={item.completed ? "completedItem" : ""}>{item.title}</h2>
        <button onClick={removeItem}>remove</button>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={handleCheck}
        />
      </div>
    </>
  );
}
export default TodoItem;
