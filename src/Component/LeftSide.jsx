import "tailwindcss";
import { FiSearch } from "react-icons/fi";
import ShapeInfoComponent from "./ShapeInfoComponent";

const LeftSide = () => {
  return (
    <div className=" container  bg-gray-200 mx-3  min-h-screen rounded-xl w-[25%]">
      <div className="flex p-3 justify-between text-2xl">
        <div className="col-10">List Of Created Object</div>
        <div className=" pt-2 pe-2 col-2"><FiSearch /></div>
      </div>
      <hr />
      <div className="ms-15">
        <ShapeInfoComponent shapeName= "Circle" />
        <ShapeInfoComponent shapeName= "Line" />
        <ShapeInfoComponent shapeName= "Ellipse" />
        <ShapeInfoComponent shapeName= "Polyline" />
      </div>


    </div>
  );
};

export default LeftSide;
