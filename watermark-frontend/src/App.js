import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Upload from './components/Upload';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
          <Routes>       
              <Route path="/" element={<Upload />} />
          </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
