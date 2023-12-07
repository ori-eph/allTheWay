import { handleServerRequest } from "../../utils";
import "../../css/ToDo.css";

function TodoItem({ item, removeItem, checkItem, setErr, currentUser }) {
  async function handleCheck() {
    checkItem();
    try {
      await fetch(`http://localhost:3000/todo/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          token: currentUser.token,
          completed: item.completed ? 0 : 1,
        }),
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
