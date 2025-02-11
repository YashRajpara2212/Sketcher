import { PiEyeClosed } from "react-icons/pi";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

const ButtonComponent = ({ name }) => {
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
  return (
    <>
      <div className="flex my-5  p-2  rounded-sm  text-2xl items-center gap-3 justify-center border border-gray-400 me-8 hover:bg-white">
        <div>{icon}</div>
        <div>{name}</div>
      </div>
    </>
  );
};

export default ButtonComponent;
