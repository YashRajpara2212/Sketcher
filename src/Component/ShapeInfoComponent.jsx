import { TbLine } from "react-icons/tb";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoCircle } from "react-icons/go";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";

// eslint-disable-next-line react/prop-types
const ShapeInfoComponent = ({ shapeName }) => {
    let icon = null
  if (shapeName === "Line") {
     icon = <TbLine />;
  }
  if (shapeName === "Circle") {
     icon = <GoCircle />;
  }
  if (shapeName === "Ellipse") {
     icon = <TbOvalVertical />;
  }
  if (shapeName === "Polyline") {
     icon = <PiPolygonLight />;
  }
  return (
    <>
      <div className="container flex text-2xl mt-5  justify-between  hover:bg-white">
        <div className="flex">
        <div className="px-3 pt-1 ">{icon}</div>
        <div className="px-3 ">{shapeName}</div>
        </div>

        <div className="flex">
        <div className="px-3  pt-1 ">
          <IoEyeOutline />
        </div>
        <div className="px-3 pt-1 ">
          <RiDeleteBinLine />
        </div>
        </div>
      </div>
    </>
  );
};

export default ShapeInfoComponent;
