import { useState } from "react";
import "tailwindcss";
import "./App.css";
import Canvas from "./Component/Canvas";
import LeftSide from "./Component/LeftSide";
// import MainComponent from "./Component/MainComponent";
import RightSide from "./Component/RightSide";
import NavigationBar from "./Component/NavigationBar";

function App() {
  const [selectedShape, setSelectedShape] = useState("");

  return (
    <>
      <div className="relative max-w-[100vw]">
        <Canvas className="absolute" selectedShape={selectedShape} />
        {/* <div className="main-container container-fluid  w-full  m-5  py-8 px-3 flex gap-4 absolute"> */}
        <LeftSide />
        <NavigationBar setShape={setSelectedShape} />
        <RightSide />
        {/* </div> */}
      </div>
    </>
  );
}

export default App;
