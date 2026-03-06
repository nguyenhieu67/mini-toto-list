import { useEffect, useState } from "react";

import { data } from "./data";

function App() {
  const saveLang = localStorage.getItem("myAppLang") || "jp";

  const [lang, setLang] = useState(saveLang);

  useEffect(() => {
    localStorage.setItem("myAppLang", lang);
  }, [lang]);

  const d = data[lang] || data["jp"];

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
      alert(`${d.notification.duplicateTitle}!`);
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
        let newTitle = prompt(`${d.notification.editTitle}`, task.title);

        if (newTitle === null) return task;

        newTitle = newTitle.trim();

        if (!newTitle) {
          alert(`${d.notification.emptyTitle}!`);
          return task;
        }

        if (isDuplicateTask(newTitle, id)) {
          alert(`${d.notification.duplicateTitle}!`);
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
      confirm(`${d.notification.deleteTask} "${taskToDelete.title}"?`)
    ) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="absolute top-2 right-2 flex gap-2 rounded-lg bg-slate-800 p-1">
        <button
          onClick={() => setLang("en")}
          className={`rounded px-1 py-1 md:px-3 ${lang === "en" ? "bg-emerald-500" : ""}`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("jp")}
          className={`rounded px-1 py-1 md:px-3 ${lang === "jp" ? "bg-emerald-500" : ""}`}
        >
          JP
        </button>
      </div>

      <main className="max-w-150 flex-1 p-4 sm:p-12.5">
        <h1 className="mt-10 text-center text-2xl font-bold sm:mt-0 sm:text-left">
          {d.heading}
        </h1>
        <form className="mt-7.5 flex gap-2.5" onSubmit={addTask}>
          <input
            type="text"
            placeholder={`${d.inputPlaceholder}?`}
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
            {d.buttonTitle}
          </button>
        </form>
        <ul className="mt-7.5 flex flex-col gap-2.5">
          {tasks.map((task) => {
            return (
              <li
                key={task.id}
                className={`${task.completed ? "opacity-60" : ""} flex items-center rounded-lg border border-solid border-[#ea9652] px-3 py-2`}
              >
                <span
                  className={`${task.completed ? "line-through" : ""} flex-1 break-all`}
                >
                  {task.title}
                </span>
                <div className="hidden gap-4 sm:flex">
                  <button
                    onClick={() => editTask(task.id)}
                    className="text-sm font-medium text-[#50ad7e]"
                  >
                    {d.actionBtn[0]}
                  </button>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-sm font-medium text-[#ea9652]"
                  >
                    {task.completed ? d.actionBtn[1][1] : d.actionBtn[1][0]}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-sm font-medium text-[#a13538]"
                  >
                    {d.actionBtn[2]}
                  </button>
                </div>

                <div className="flex flex-col gap-4 sm:hidden">
                  <div className="flex justify-between">
                    <button
                      onClick={() => editTask(task.id)}
                      className="text-sm font-medium text-[#50ad7e]"
                    >
                      {d.actionBtn[0]}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-sm font-medium text-[#a13538]"
                    >
                      {d.actionBtn[2]}
                    </button>
                  </div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-sm font-medium text-[#ea9652]"
                  >
                    {task.completed ? d.actionBtn[1][1] : d.actionBtn[1][0]}
                  </button>
                </div>
              </li>
            );
          })}

          {tasks.length === 0 && (
            <li className="text-center text-[#888888] italic">{d.emptyMsg}.</li>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
