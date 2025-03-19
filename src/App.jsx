import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editedId, setEditedId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editModal, setEditModal] = useState(false);
  console.log("tasks", tasks);
  console.log("completed tasks", completedTasks);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setNewTask("");
  };
  const editModalOpen = (id, task) => {
    setEditedId(id);
    setEditedTask(task);
    setEditModal(true);
  };
  const editModalClose = () => {
    setEditedId(null);
    setEditedTask("");
    setEditModal(false);
  };

  const handleDelete = (index) => {
    let taskFlag = false;
    tasks.map((item) => {
      if (item.id === index) taskFlag = true;
    });
    if (taskFlag) {
      setTasks((prevTask) => {
        return prevTask.filter((item) => item.id !== index);
      });
    }
    setCompletedTasks((prevTask) => {
      return prevTask.filter((item) => item.id !== index);
    });

    // setTasks((prevTask) => {
    //   return prevTask.filter((tasks) => tasks.id !== index);
    // });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      const now = new Date();
      const localDate = now.toLocaleString();
      setTasks([
        ...tasks,
        { id: uuidv4(), task: newTask, completed: false, createdAt: localDate },
      ]);
    }
    closeModal();
  };
  const handleEdit = (e) => {
    e.preventDefault();
    console.log(editedTask, editedId, tasks);
    if (editedTask.trim() !== "") {
      const now = new Date();
      const localDate = now.toLocaleString();
      setTasks((prevTask) => {
        return prevTask.map((task) => {
          return task.id === editedId
            ? { ...tasks, task: editedTask, createdAt: localDate }
            : task;
        });
      });
    }
    editModalClose();
  };

  const handleComplete = (id, task) => {
    handleDelete(id);
    const now = new Date();
    const localDate = now.toLocaleString();
    setCompletedTasks([
      ...completedTasks,
      { id: id, task: task, completed: true, completedAt: localDate },
    ]);
  };

  useEffect(() => {
    console.log("Tasks before saving:", tasks);
    if (tasks && tasks.length > 0) {
      // Add length check
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tasks saved to local storage.");
    } else {
      console.log("tasks array is empty or null");
    }
  }, [tasks]);

  useEffect(() => {
    console.log("Loading tasks from local storage...");
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const items = JSON.parse(storedTasks);
        console.log("Loaded tasks:", items);
        setTasks(items);
      } catch (error) {
        console.error("Error parsing tasks:", error);
        setTasks([]);
      }
    } else {
      console.log("No tasks found in local storage.");
      setTasks([]);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-amber-300 ">
      <div className="flex flex-col justify-center items-center  bg-green-500 m-2 max-w-[80%] md:min-w-[30%] min-w-[20%]">
        <div className="p-2 bg-green-200 flex w-full justify-center">
          <span className="text-3xl ">Saif's tasks</span>
        </div>
        <div className="bg-green-300 w-full flex justify-center p-2">
          <span onClick={openModal} className="text-xl cursor-pointer">
            Add a new task +{" "}
          </span>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black opacity-85 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-1/2">
              <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col justify-center">
                  <label className="m-2" htmlFor="task">
                    Task
                  </label>
                  <input
                    id="task"
                    placeholder="your task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="text-black text-xl m-2 p-2"
                  />
                  <button className="bg-blue-700 m-2 py-2 px-4 shadow-2xl rounded-xl w-fit justify-center cursor-pointer">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {editModal && (
          <div className="fixed inset-0 bg-black opacity-85 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-1/2">
              <form onSubmit={handleEdit}>
                <div className="flex flex-col justify-center">
                  <input
                    type="text"
                    value={editedId}
                    className="cursor-not-allowed"
                    readOnly
                  />
                  <label className="m-2" htmlFor="task">
                    Edit task
                  </label>
                  <input
                    id="task"
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    className="text-black text-xl m-2 p-2"
                  />
                  <button className="bg-blue-700 m-2 py-2 px-4 shadow-2xl rounded-xl w-fit justify-center cursor-pointer">
                    update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="bg-green-400 p-2 flex justify-center w-full">
          <span>Search a task</span>
        </div>
        <div className="overflow-x-auto w-full bg-yellow-200 flex flex-col justify-center items-center">
          <span className="text-center">Active tasks</span>
          <ol className=" list-decimal  p-3 m-2">
            {tasks.length ? (
              tasks.map((item) => {
                return (
                  <div key={item?.id}>
                    <li className="w-full ">
                      <div className="flex">
                        <span className="text-xl w-2/3">{item?.task}</span>
                        <div className="flex flex-row gap-3 items-center mx-2 px-2 my-1 py-1">
                          <span
                            onClick={() => editModalOpen(item.id, item.task)}
                            className="text-sm"
                          >
                            edit
                          </span>
                          <span
                            onClick={() => handleDelete(item.id)}
                            className="text-sm cursor-pointer"
                          >
                            delete
                          </span>
                          <span
                            onClick={() => handleComplete(item.id, item.task)}
                            className="text-sm whitespace-nowrap"
                          >
                            mark as completed
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-sm">
                          created at: {item?.createdAt}
                        </span>
                      </div>
                    </li>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center">
                no tasks found
              </div>
            )}
          </ol>
        </div>
        <div className="w-full overflow-x-auto flex flex-col">
          <span className="self-center">Completed Tasks</span>
          <ol className="list-decimal p-2 m-3">
            {completedTasks.length ? (
              completedTasks.map((task) => {
                return (
                  <div className="w-full">
                    <li>
                      <div className="flex flex-col justify-start items-center gap-3">
                        <div className="flex justify-between items-center gap-4 w-full">
                          <span className="text-xl">{task.task}</span>
                          <span
                            className="cursor-pointer"
                            onClick={() => handleDelete(task.id)}
                          >
                            delete
                          </span>
                        </div>
                        <div className="self-end">
                          <span className="text-sm">
                            Completed at: {task.completedAt}
                          </span>
                        </div>
                      </div>
                    </li>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center">
                <span className="">No Completed tasks</span>
              </div>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
