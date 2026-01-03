import { useEffect, useState } from "react";
import "../App.css";

let TodoItem = () => {
  const [inVal, setInVal] = useState({ todo: "" });

  const [editIni, setEditIni] = useState({ todo: "" });
  const [listData, setListData] = useState([]);
  const [checkEdit, setCheckEdit] = useState(false);
  const [checkedID, setCheckedId] = useState([]);
  const [taskComplete, setTaskComplate] = useState(false);

  let changeHandle = (e) => {
    let { name, value } = e.target;
    setInVal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    let getLocalData = JSON.parse(localStorage.getItem("submitData"));
    setListData(getLocalData || []);
  }, [inVal, checkEdit]);

  let submitHandler = () => {
    if (inVal.todo.length > 2) {
      let data = {
        _id: Date.now(),
        list: inVal.todo,
        read: false,
      };
      setInVal({ todo: "" });
      let addStorageData = JSON.parse(localStorage.getItem("submitData")) || [];
      addStorageData.push(data);
      localStorage.setItem("submitData", JSON.stringify(addStorageData));
    }
  };

  let deleteHandle = (_id) => {
    let confirm = window.confirm("Are you sure you want to delete this record");
    if (!confirm) return;
    let filterData = listData.filter((data) => {
      return data._id !== _id;
    });
    setListData(filterData || []);
    localStorage.setItem("submitData", JSON.stringify(filterData));
    console.log(filterData);
  };

  let editHandle = (val) => {
    // console.log("_id", val);
    if (!val._id) return false;
    setCheckEdit(true);
    let ediValue = { todo: val.list, _id: val._id };
    setEditIni(ediValue);
  };

  let changeEditHandle = (e) => {
    let editVal = e.target.value;
    setEditIni((prev) => ({ ...prev, todo: editVal }));
  };

  let editHandler = () => {
    let editInitial = editIni;
    let preveousStoreData = listData;

    preveousStoreData.map((e) => {
      if (e._id == editInitial._id) {
        e.list = editInitial.todo;
      }
    });

    let editInsertData = JSON.stringify(preveousStoreData);
    localStorage.setItem("submitData", editInsertData);
    setEditIni({ todo: "" });
    setCheckEdit(false);
  };

  const checkHandler = (id, checked) => {
    //  console.log("checked==>",checked)

    if (checked) {
      setCheckedId((pre) => [...pre, id]);
    } else {
      // let filterCHecked=checkedID.filter((e)=>e.id !=id )
      setCheckedId((prev) => prev.filter((e) => e !== id));
    }

    //  console.log("checked==>",checkedID)
  };

  let completeTask = () => {
    setListData((prev) => {
      let updateData = prev.map((e) =>
        checkedID.includes(e._id) ? { ...e, read: true } : e
      );
      localStorage.setItem("submitData", JSON.stringify(updateData));
      return updateData;
    });

    // let completedData = JSON.stringify(listData);
    // localStorage.setItem("submitData", completedData);
    console.log("checked==>", listData);
  };
  return (
    <>
      <div className="todo-app ">
        <h1>📝 My To-Do List</h1>

        <div className="todo-input">
          {checkEdit ? (
            <input
              type="text"
              name="todo"
              placeholder="Edit task..."
              value={editIni.todo}
              onChange={changeEditHandle}
            />
          ) : (
            <input
              type="text"
              name="todo"
              placeholder="Add a new task..."
              value={inVal.todo}
              onChange={changeHandle}
            />
          )}
          {checkEdit ? (
            <button onClick={editHandler}>Edit</button>
          ) : (
            <button onClick={submitHandler}>Add</button>
          )}
        </div>

        <div className="filters">
          <button className="active">All</button>
          <button onClick={completeTask}>Completed</button>
          <button>Incomplete</button>
        </div>

        <ul className="todo-list">
          {/* <li className="todo-item completed">
            <input type="checkbox" checked />
            <span className="task-text">Buy groceries</span>
            <button className="delete-btn">🗑️</button>
          </li> */}
          {listData.length > 0 ? (
            listData.map((val, index) => (
              <li
                key={val._id ?? index}
                className={`todo-item ${val.read ? "completed" : ""}`}
              >
                {!val.read && (
                  <input
                    type="checkbox"
                    onChange={(e) => checkHandler(val._id, e.target.checked)}
                  />
                )}
                <span className="task-text">{val.list}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteHandle(val._id)}
                >
                  🗑️
                </button>

                <button className="edit-btn" onClick={() => editHandle(val)}>
                  ✏️
                </button>
              </li>
            ))
          ) : (
            <p>No tasks yet.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default TodoItem;
