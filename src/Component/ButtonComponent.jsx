import { PiEyeClosed } from "react-icons/pi";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { shapeStore } from "../ShapeStore";

const ButtonComponent = ({ name, entityID, handleClick }) => {
  let icon = null;
  if (name === "Hide") {
    icon = <PiEyeClosed />;
  }
  if (name === "Update") {
    icon = <GrUpdate />;
  }
  if (name === "Delete") {
    icon = <RiDeleteBinLine />;
  }

  const handleButtonClick = (id) => {
    handleClick(id);
    console.log(shapeStore.shapes, "shapes in button");
  };
  return (
    <>
      <div
        className="flex my-5  p-2  rounded-sm  text-2xl items-center gap-3 justify-center border border-gray-400 me-8 hover:bg-white"
        onClick={() => {
          handleButtonClick(entityID);
        }}
      >
        <div>{icon}</div>
        <div>{name}</div>
      </div>
    </>
  );
};

export default ButtonComponent;
