import { TbLine } from "react-icons/tb";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoCircle } from "react-icons/go";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { shapeStore } from "../ShapeStore";

// eslint-disable-next-line react/prop-types
const ShapeInfoComponent = ({ shapeName, entityId }) => {
  let icon = null;
  let entity = entityId;
  console.log(entity, "ab");

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

  const handleHide = (entity) => {
    // console.log(entityId, "entityid");
    shapeStore.hideEntity(entity);
  };
  return (
    <>
      <div className="container flex text-2xl mt-5  justify-between  hover:bg-white">
        <div className="flex">
          <div className="px-3 pt-1 ">{icon}</div>
          <div className="px-3 ">{shapeName}</div>
        </div>

        <div className="flex">
          <div className="px-3  pt-1 " onClick={handleHide}>
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
