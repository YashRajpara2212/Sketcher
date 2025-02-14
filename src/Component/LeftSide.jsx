import "tailwindcss";
import { observer } from "mobx-react";
import { shapeStore } from "../ShapeStore";
import { FiSearch } from "react-icons/fi";
import ShapeInfoComponent from "./ShapeInfoComponent";

const LeftSide = observer(() => {
  const shapes = shapeStore.shapes;
  console.log(shapes, "all shapes1");
  const handleClick = (e) => {
    shapeStore.setEntity(e);
  };
  return (
    <div className=" container absolute left-0 top-0 z-10 m-5  bg-gray-200 mx-3  min-h-[95vh] rounded-xl w-[25%]">
      <div className="flex p-3 justify-between text-2xl">
        <div className="col-10">List Of Created Object</div>
        <div className=" pt-2 pe-2 col-2">
          <FiSearch />
        </div>
      </div>
      <hr />
      <div className="ms-15">
        {shapes?.map((e) => (
          <div key={e.uuid} onClick={() => handleClick(e)}>
            <ShapeInfoComponent shapeName={e.name} entityId={e.uuid} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default LeftSide;
