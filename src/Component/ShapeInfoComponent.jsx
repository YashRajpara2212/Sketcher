import { TbLine } from "react-icons/tb";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoCircle } from "react-icons/go";
import { TbOvalVertical } from "react-icons/tb";
import { PiPolygonLight } from "react-icons/pi";
import { shapeStore } from "../ShapeStore";
import { observer } from "mobx-react";

// eslint-disable-next-line react/prop-types
const ShapeInfoComponent = observer(({ shapeName, entityId }) => {
  let icon = null;

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

  const handleHide = (id) => {
    shapeStore.hideEntity(id);
  };

  const handleRemove = (id) => {
    shapeStore.removeEntity(id);
    shapeStore.setEntity(null);
  };
  const currentEntity = shapeStore.Entity();
  // console.log(currentEntity, "cur");

  const isSelected = entityId === currentEntity?.uuid;
  // console.log(isSelected, "hi");
  return (
    <>
      <div
        className={`container flex text-2xl mt-5  justify-between  hover:bg-white ${
          isSelected ? "bg-white" : ""
        } `}
      >
        <div className="flex">
          <div className="px-3 pt-1 ">{icon}</div>
          <div className="px-3 ">{shapeName}</div>
        </div>

        <div className="flex">
          <div className="px-3  pt-1 " onClick={() => handleHide(entityId)}>
            <IoEyeOutline />
          </div>
          <div className="px-3 pt-1 " onClick={() => handleRemove(entityId)}>
            <RiDeleteBinLine />
          </div>
        </div>
      </div>
    </>
  );
});

export default ShapeInfoComponent;
