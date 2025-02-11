import "./App.css";
import Canvas from "./Component/Canvas";
import LeftSide from "./Component/LeftSide";
import MainComponent from "./Component/MainComponent";
import RightSide from "./Component/RightSide";

function App() {
  return (
    <>
      <Canvas />
      <div className="relative">
        <div className="main-container container-fluid  w-full  m-5  py-8 px-3 flex gap-4 absolute">
          <LeftSide />
          <MainComponent />
          <RightSide />
        </div>
      </div>
    </>
  );
}

export default App;
