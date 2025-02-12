// eslint-disable-next-line no-unused-vars
import React from "react";
import Geometry from "./Geometry";

const NavigationBar = ({ setShape }) => {
  return (
    <>
      <div className="container absolute left-145 top-0 m-5 z-10 flex h-[85px] text-2xl ">
        <div className=" flex bg-gray-100 rounded-2xl py-3 px-3 ms-10 bg-gray-200">
          <div>
            <Geometry
              onClick={() => {
                setShape("Line");
              }}
              name="Line"
            />
          </div>
          <div>
            <Geometry
              name="Circle"
              onClick={() => {
                setShape("Circle");
              }}
            />
          </div>
          <div>
            <Geometry
              name="Ellipse"
              onClick={() => {
                setShape("Ellipse");
              }}
            />
          </div>
          <div>
            <Geometry
              name="Polyline"
              onClick={() => {
                setShape("Polyline");
              }}
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl py-3 ms-8 bg-gray-200">
          <Geometry name="Save" />
        </div>
        <div className="bg-gray-100 rounded-2xl py-3 ms-3 bg-gray-200">
          <Geometry name="Upload" />
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
