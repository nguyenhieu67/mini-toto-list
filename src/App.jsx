import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const isDuplicateTask = (newTitle, id) => {
    const isDuplicate = tasks.some(
      (task, index) =>
        task.title.toLowerCase() === newTitle.toLowerCase() && id !== index,
    );

    return isDuplicate;
  };

  const addTask = (e) => {
    e.preventDefault();

    const value = inputValue.trim();

    if (!value) return;

    if (isDuplicateTask(value)) {
      alert(
        "Task with this title already exists! Please use a different title.",
      );
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: value,
        completed: false,
      },
    ]);
    setInputValue("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        return task.id === id ? { ...task, completed: !task.completed } : task;
      }),
    );
  };

  const editTask = (id) => {
    const newTask = tasks.map((task) => {
      if (task.id === id) {
        let newTitle = prompt("Enter the new task title", task.title);

        if (newTitle === null) return task;

        newTitle = newTitle.trim();

        if (!newTitle) {
          alert("Task title cannot be empty!");
          return task;
        }

        if (isDuplicateTask(newTitle, id)) {
          alert(
            "Task with this title already exists! Please use a different task title!",
          );
          return task;
        }

        return { ...task, title: newTitle };
      }

      return task;
    });

    setTasks(newTask);
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (
      taskToDelete &&
      confirm(`Aru you sure you want to delete "${taskToDelete.title}"?`)
    ) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="flex justify-center">
      <main className="max-w-150 flex-1 p-12.5">
        <h1 className="text-2xl font-bold">Create your Todo-List</h1>
        <form className="mt-7.5 flex gap-2.5" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What are your tasks for today?"
            value={inputValue}
            spellCheck="false"
            className="flex-1 rounded-lg border border-solid border-[#ffffff] bg-transparent px-3 py-2 font-medium"
            onChange={(e) => {
              const value = e.target.value;
              if (value.startsWith(" ")) return;
              return setInputValue(value);
            }}
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-lg border border-solid border-[#ffffff] bg-transparent px-3 py-2 font-medium"
          >
            Add
          </button>
        </form>
        <ul className="mt-7.5 flex flex-col gap-2.5">
          {tasks.map((task) => {
            return (
              <li
                key={task.id}
                className={`${task.completed ? "opacity-60" : ""} flex rounded-lg border border-solid border-[#ea9652] px-3 py-2`}
              >
                <span
                  className={`${task.completed ? "line-through" : ""} flex-1`}
                >
                  {task.title}
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={() => editTask(task.id)}
                    className="text-sm font-medium text-[#50ad7e]"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-sm font-medium text-[#ea9652]"
                  >
                    {task.completed ? "MARK AS UNDONE" : "MARK AS DONE"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-sm font-medium text-[#a13538]"
                  >
                    DELETE
                  </button>
                </div>
              </li>
            );
          })}

          {tasks.length === 0 && (
            <li className="text-center text-[#888888] italic">
              No tasks available.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
