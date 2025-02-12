// import React from 'react'
import { TbLine } from "react-icons/tb";
// import { IoEyeOutline } from "react-icons/io5";
// import { RiDeleteBinLine } from "react-icons/ri";
import { GoCircle } from "react-icons/go";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { AiOutlineSave } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";

const Geometry = ({ name, onClick }) => {
  let icon = null;
  if (name === "Line") {
    icon = <TbLine />;
  }
  if (name === "Circle") {
    icon = <GoCircle />;
  }
  if (name === "Ellipse") {
    icon = <TbOvalVertical />;
  }
  if (name === "Polyline") {
    icon = <PiPolygonLight />;
  }
  if (name === "Save") {
    icon = <AiOutlineSave />;
  }
  if (name === "Upload") {
    icon = <FiUpload />;
  }

  return (
    <>
      <div
        className="flex flex-col items-center mx-2  w-20  "
        onClick={onClick}
      >
        <div className="">{icon}</div>
        <div className="">{name}</div>
      </div>
    </>
  );
};
// export ;
export default Geometry;
