import ButtonComponent from "./ButtonComponent";
import InputNumber from "./InputNumber";
import ColorComponent from "./ColorComponent";
import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { shapeStore } from "../ShapeStore";
// import * as THREE from "three";

const RightSide = observer(() => {
  // const [entity, setEntity] = useState(null);
  const entity = shapeStore.Entity();

  const [circleCenter, setCircleCenter] = useState({ x: 0, y: 0, z: 0 });
  const [circleRadius, setCircleRadius] = useState(null);
  const [ellipseCenter, setEllipseCenter] = useState({ x: 0, y: 0, z: 0 });
  const [Rx, setRx] = useState(null);
  const [Ry, setRy] = useState(null);
  const [lineStart, setLineStart] = useState([]); //{ x: 0, y: 0, z: 0 }
  const [lineEnd, setLineEnd] = useState([]); //{ x: 0, y: 0, z: 0 }
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [opacity, setOpacity] = useState(null);

  // setColor([entity.material.color.r,entity.material.color.g,entity.material.color.b])
  useEffect(() => {
    if (entity?.name === "Circle") {
      setCircleCenter(entity.center);
      setCircleRadius(entity.geometry.parameters.radius);
    }
    if (entity?.name === "Ellipse") {
      const ellipseRadius = shapeStore.getEllipseRadius(entity?.uuid);

      console.log(ellipseRadius, "ellipse-radius");
      // if (Array.isArray(ellipseRadius) && ellipseRadius.length >= 2) {
      //   setEllipseCenter(entity.position);
      //   setRx(ellipseRadius[0]);
      //   setRy(ellipseRadius[1]);
      // } else {
      //   // If the radius is not valid, you can set default values or leave it as null
      //   console.error("Invalid ellipse radius:", ellipseRadius);
      //   setRx(null);
      //   setRy(null);
      // }
      setEllipseCenter(entity.position);
      setRx(ellipseRadius[0]);
      setRy(ellipseRadius[1]);
      // ellipseCenter = entity.position;
      // ellipseRadius = shapeStore.getEllipseRadius(entity?.uuid);
      // Rx = ellipseRadius[0];
      // Ry = ellipseRadius[1];

      // console.log(shapeStore.getEllipseRadius(entity?.uuid), "radius");
    }
    if (entity?.name === "Line") {
      setLineStart(entity.geometry.attributes.position.array.slice(0, 3));
      setLineEnd(entity.geometry.attributes.position.array.slice(3, 6));
      console.log(lineStart, "start", lineEnd, "end");
    }

    if (entity?.name === "Polyline") {
      const points = entity.geometry.attributes.position.array;
      const polylinePoints = Array.from({
        length: (points.length - 3) / 3,
      }).map((_, index) => ({
        x: points[index * 3],
        y: points[index * 3 + 1],
        z: points[index * 3 + 2],
      }));
      setPolylinePoints(polylinePoints);
    }
    if (entity?.material) {
      const { r, g, b } = entity.material.color;
      setColor({
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      });
      //g: entity?.material.color.g * 255
    }
    if (entity?.material) {
      const opacity = Math.round(entity.material?.opacity * 100);
      setOpacity(opacity);
    }
  }, [entity]);

  console.log(shapeStore.scene, "last scene");
  //handler
  const handleLineStartChange = (axis, value) => {
    const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    setLineStart((prevState) => {
      const newStart = [...prevState]; // Make a copy of the array
      newStart[axisIndex] = value; // Update the corresponding axis
      return newStart;
    });
  };

  const handleLineEndChange = (axis, value) => {
    const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    setLineEnd((prevState) => {
      const newEnd = [...prevState]; // Make a copy of the array
      newEnd[axisIndex] = value; // Update the corresponding axis
      return newEnd;
    });
    // setLineEnd((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handlePolylinePointChange = (index, axis, value) => {
    const updatedPoints = [...polylinePoints];
    updatedPoints[index][axis] = value;
    setPolylinePoints(updatedPoints);
  };

  const handleCircleCenterChange = (axis, value) => {
    setCircleCenter((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handleEllipseCenterChange = (axis, value) => {
    setEllipseCenter((prevState) => ({ ...prevState, [axis]: value }));
  };

  const handleCircleRadiusChange = (value) => {
    setCircleRadius(value);
  };

  const handleEllipseRadiusXChange = (value) => {
    setRx(value);
  };

  const handleEllipseRadiusYChange = (value) => {
    setRy(value);
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  };

  const handleColor = (value) => {
    setColor(value);
  };

  const handleOpacity = (value) => {
    setOpacity(Math.max(0, Math.min(100, value)));

    // setOpacity(value)
  };
  const handleHide = (id) => {
    shapeStore.hideEntity(id);
  };

  console.log(shapeStore.shapes, "all shapes");
  const handleRemove = (id) => {
    shapeStore.removeEntity(id);
    // shapeStore.setEntity(null);
    // setEntity(null);
  };

  const handleUpdate = (entityId) => {
    const updatedProperties = {
      color,
      opacity,
      lineStart,
      lineEnd,
      ellipseCenter,
      Rx,
      Ry,
      circleCenter,
      circleRadius,
      polylinePoints,
    };

    shapeStore.updateEntity(entityId, updatedProperties); // Pass the updated properties to the store
  };

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
          {entity.name === "Line" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Starting Point</div>
                <InputNumber
                  label="x"
                  value={lineStart[0]} //{lineStart.x}
                  onChange={(value) => handleLineStartChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={lineStart[1]} //{lineStart.y}
                  onChange={(value) => handleLineStartChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={lineStart[2]} //{lineStart.z}
                  onChange={(value) => handleLineStartChange("z", value)}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-xl">Ending Point</div>
                <InputNumber
                  label="x"
                  value={lineEnd[0]} //{lineEnd.x}
                  onChange={(value) => handleLineEndChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={lineEnd[1]} //{lineEnd.y}
                  onChange={(value) => handleLineEndChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={lineEnd[2]} //{lineEnd.z}
                  onChange={(value) => handleLineEndChange("z", value)}
                />
              </div>
            </div>
          )}
          {entity.name === "Circle" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber
                  label="x"
                  value={circleCenter.x}
                  onChange={(value) => handleCircleCenterChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={circleCenter.y}
                  onChange={(value) => handleCircleCenterChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={circleCenter.z}
                  onChange={(value) => handleCircleCenterChange("z", value)}
                />
              </div>

              <div>
                <div className="text-xl">Radius</div>
                <InputNumber
                  label="R"
                  value={circleRadius}
                  onChange={handleCircleRadiusChange}
                />
                {/* <InputNumber label="R" value={circleRadius} /> */}
              </div>
            </div>
          )}
          {entity.name === "Ellipse" && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                <div className="text-xl">Center</div>
                <InputNumber
                  label="x"
                  value={ellipseCenter.x}
                  onChange={(value) => handleEllipseCenterChange("x", value)}
                />
                <InputNumber
                  label="y"
                  value={ellipseCenter.y}
                  onChange={(value) => handleEllipseCenterChange("y", value)}
                />
                <InputNumber
                  label="z"
                  value={ellipseCenter.z}
                  onChange={(value) => handleEllipseCenterChange("z", value)}
                />
              </div>
              <div className="flex flex-col gap-4 mb-3 w-full">
                <div className="text-xl">Radius</div>
                <InputNumber
                  label="Rx"
                  value={Rx}
                  onChange={handleEllipseRadiusXChange}
                />
                <InputNumber
                  label="Ry"
                  value={Ry}
                  onChange={handleEllipseRadiusYChange}
                />
              </div>
            </div>
          )}
          {entity.name === "Polyline" && (
            <div>
              {polylinePoints.map((point, index) => (
                <div key={index} className="flex flex-col gap-4 mb-3">
                  <div className="text-xl">Point {index + 1}</div>
                  <InputNumber
                    label="x"
                    value={point.x}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "x", value)
                    }
                  />
                  <InputNumber
                    label="y"
                    value={point.y}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "y", value)
                    }
                  />
                  <InputNumber
                    label="z"
                    value={point.z}
                    onChange={(value) =>
                      handlePolylinePointChange(index, "z", value)
                    }
                  />
                </div>
              ))}
            </div>
          )}
          <ButtonComponent
            name="Update"
            entityID={entity.uuid}
            handleClick={handleUpdate}
          />
          <div className="text-xl">Color</div>
          <ColorComponent
            value={rgbToHex(color.r, color.g, color.b)}
            onColorChange={(value) => {
              handleColor(value);
            }}
            opacity={opacity}
            handleOpacity={handleOpacity}
          />
          <ButtonComponent
            name="Hide"
            entityID={entity.uuid}
            handleClick={handleHide}
          />
          <ButtonComponent
            name="Delete"
            entityID={entity.uuid}
            handleClick={handleRemove}
          />
        </>
      ) : (
        <div className="text-xl">Select a shape to see its properties.</div>
      )}
    </div>
  );
});

export default RightSide;
