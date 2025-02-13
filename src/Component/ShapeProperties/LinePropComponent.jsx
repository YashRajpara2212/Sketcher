// import React from 'react'
import InputNumber from "../InputNumber";
import { shapeStore } from "../../ShapeStore";
import { observer } from "mobx-react";
// import ColorComponent from "./ColorComponent";
// import ButtonComponent from "./ButtonComponent";
const LinePropComponent = observer(() => {
  //   let value = 1;
  const entity = shapeStore?.Entity();
  console.log(entity, "aa");
  const points = entity?.geometry.attributes.position.array;
  console.log(points);
  return (
    <>
      <div className="text-2xl mt-3 ps-6 mb-1">Properties:</div>
      <div className="text-xl ps-6 mb-1">
        {}Polyline {}1
      </div>
      <hr className="border border-gray-400" />

      <div className="text-2xl ps-6 mb-1">Starting Point</div>
      {points?.map((p, index) => (
        <div className="ps-6" key={index}>
          <span>{p}</span>
          {/* <InputNumber lable={"x"} value={p} /> */}
        </div>
      ))}
    </>
  );
});

export default LinePropComponent;

{
  /* <div className="ps-6">
        <InputNumber lable={"x"} value={value} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"y"} value={value} />
      </div>
      <div className="ps-6">
        <InputNumber lable={"z"} value={value} />
      </div> */
}
