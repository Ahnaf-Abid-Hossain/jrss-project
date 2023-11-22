import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Upload from './components/Upload';
import Header from './components/Header';
import Hello from './components/Hello';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
          <Routes>       
              <Route path="/app" element={<Upload />} />
              <Route path="/hello" element={<Hello />} />
          </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
