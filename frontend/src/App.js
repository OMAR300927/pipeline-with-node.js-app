import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("/api/tasks")
      .then(res => setTasks(res.data));
  }, []);

  const addTask = () => {
    axios.post("/api/tasks", { title })
      .then(() => window.location.reload());
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Task App</h1>
      <input onChange={e => setTitle(e.target.value)} />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map(t => <li key={t.id}>{t.title}</li>)}
      </ul>
    </div>
  );
}

export default App;
