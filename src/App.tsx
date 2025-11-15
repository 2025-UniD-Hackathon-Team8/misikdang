// src/App.tsx

import "./App.css";
// import Button from "./components/Button"; // Button 컴포넌트는 사용하지 않으므로 주석 처리하거나 제거 가능

// 1. components 폴더에서 Profile 컴포넌트를 import 합니다.
import Profile from "./components/Profile";

function App() {
  return (
    <>
      {/* 2. 기존 <div> 안에 Profile 컴포넌트를 렌더링합니다. */}
      <div>
        <Profile />
      </div>
    </>
  );
}

export default App;
