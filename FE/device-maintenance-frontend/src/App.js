// File gốc Create React App (tương đương App.jsx). Giữ nguyên, không xóa.
// File này là component gốc, bọc Router và gắn các route của ứng dụng.

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
