import { Routes, Route } from "react-router-dom";
import User from "./User";
function App() {
  return (
      <Routes>
        <Route path="/" element={<User />}></Route>
        <Route path="/logs" element={<User />}></Route>
      </Routes>
  );
}

export default App;
