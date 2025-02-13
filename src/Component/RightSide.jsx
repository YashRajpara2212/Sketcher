import ButtonComponent from "./ButtonComponent";
import InputNumber from "./InputNumber";
// import ColorComponent from "./ColorComponent";
// import LinePropComponent from "./ShapeProperties/LinePropComponent";
import { observer } from "mobx-react";
import { shapeStore } from "../ShapeStore";
// import { PiEyeClosed } from "react-icons/pi";
// import { GrUpdate } from "react-icons/gr";
// import { RiDeleteBinLine } from "react-icons/ri";

const RightSide = observer(() => {
  const entity = shapeStore.Entity();
  console.log(entity, "dh");
  const points = entity?.geometry.attributes.position.array;

  const getCoordinates = (index) => {
    if (points && points.length >= index * 3 + 3) {
      return {
        x: points[index * 3],
        y: points[index * 3 + 1],
        z: points[index * 3 + 2],
      };
    }
    return { x: 0, y: 0, z: 0 };
  };

  // const val = 0.01;
  // function getValue() {
  //     return value = 0.01;
  //     setval
  // }
  return (
    //container flex-col absolute right-0 top-0 z-10 m-5 p-5 bg-gray-200 mx-3   min-h-screen rounded-xl w-[25%]
    <div className="container flex-col absolute right-0 top-0 z-10 m-5 p-5 bg-gray-200 mx-3   max-h-[95vh] overflow-auto rounded-xl w-[25%] ">
      <div className="font-bold text-2xl">Properties</div>
      {entity ? (
        <>
          <div className="mb-4 text-xl">{entity.name}</div>{" "}
          {/* Show shape's name */}
          <hr className="my-4" />
          {/* Properties based on selected shape */}
          {entity.name === "Line" && points && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Starting Point</div>
                <InputNumber label="x" value={getCoordinates(0).x} />
                <InputNumber label="y" value={getCoordinates(0).y} />
                <InputNumber label="z" value={getCoordinates(0).z} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl">Ending Point</div>
                <InputNumber label="x" value={getCoordinates(1).x} />
                <InputNumber label="y" value={getCoordinates(1).y} />
                <InputNumber label="z" value={getCoordinates(1).z} />
              </div>
            </div>
          )}
          {entity.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber label="x" />
                <InputNumber label="y" />
                <InputNumber label="z" />
              </div>
              <div>
                <div className="text-xl">Radius</div>
                <InputNumber label="R" />
              </div>
            </div>
          )}
          {entity.name === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber label="x" />
                <InputNumber label="y" />
                <InputNumber label="z" />
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div className="text-xl">Radius</div>
                <InputNumber label="Rx" />
                <InputNumber label="Ry" />
              </div>
            </div>
          )}
          {entity.name === "Polyline" && points && (
            <div>
              {Array.from({ length: (points.length - 6) / 3 }).map(
                (_, index) => (
                  <div key={index} className="flex flex-col gap-4 mb-3">
                    <div className="text-xl">Point {index + 1}</div>
                    <InputNumber label="x" value={getCoordinates(index).x} />
                    <InputNumber label="y" value={getCoordinates(index).y} />
                    <InputNumber label="z" value={getCoordinates(index).z} />
                  </div>
                )
              )}
            </div>
          )}
          <ButtonComponent name="Update" />
          <div className="text-xl">Color</div>
          <div>
            <input type="color" />
          </div>
          <ButtonComponent name="Hide" />
          <ButtonComponent name="Delete" />
        </>
      ) : (
        <div className="text-xl">Select a shape to see its properties.</div>
      )}

      {/* <LinePropComponent/> */}
      {/* <div className="text-2xl mt-3 ps-6 mb-1">Properties:</div>
      <div className="text-xl ps-6 mb-1">
        {}Polyline {}1
      </div>
      <hr className="border border-gray-400" />

      <div className="text-2xl ps-6 mb-1">Starting Point</div>

      <div className="ps-6">
        <InputNumber lable={"x"} value={val} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"y"} value={val} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"z"} value={val} />
      </div>

      <div className="text-2xl ps-3 mb-1">Ending Point</div>
      <div className="ps-6">
        <InputNumber lable={"x"} value={val} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"y"} value={val} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"z"} value={val} />
      </div>

      <div className="ps-6">
        <ButtonComponent name="Update" />
      </div>

      <div className="text-2xl ps-6 mb-1">Color</div>
      
      <div className="ps-6 text-xl">
        <ColorComponent />
      </div>
      <div className="ps-6">
        <ButtonComponent name="Hide" />
      </div>
      <div className="ps-6">
        <ButtonComponent name="Delete" />
      </div> */}
    </div>
  );
});

export default RightSide;

{
  /* <div className="ps-6 flex">
        <div className="w-1/6 p-1">
          <input type="color" />
        </div>
        <div className="w-2/3 p-1">RGB()</div>
        <div className="bg-white p-1 w-1/6 me-10">100%</div>
      </div> */
}
