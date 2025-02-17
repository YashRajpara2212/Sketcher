// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import Geometry from "./Geometry";
import { shapeStore } from "../ShapeStore";
import { observer } from "mobx-react";

const NavigationBar = observer(({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const shapesData = JSON.parse(e.target.result); // Parse the content as JSON
          onUpload(shapesData); // Pass parsed data to uploadAllEntity
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      };
      reader.readAsText(file); // Read the file content as text
    } else {
      console.error("No file selected or invalid file.");
    }
    event.target.value = null;
  };

  const handleUploadClick = (event) => {
    fileInputRef.current.click();
    event.target.value = null;
  };
  const isSelected = (shape) => shapeStore.selectedShape === shape;
  // };
  return (
    <>
      <div className="container absolute left-[26%] w-[50%] top-0 m-5 z-10 flex h-[85px] text-2xl ">
        <div className=" flex bg-gray-100 rounded-2xl py-3 px-3 ms-10 bg-gray-200">
          <div
            className={`hover:bg-white rounded-xl ${
              isSelected("Line") ? "bg-white" : ""
            }`}
          >
            <Geometry
              onClick={() => {
                shapeStore.setSelectedShape("Line");
              }}
              name="Line"
            />
          </div>
          <div className={`hover:bg-white rounded-xl ${isSelected("Circle") ? "bg-white" : ""}`}>
            <Geometry
              name="Circle"
              onClick={() => {
                shapeStore.setSelectedShape("Circle");
              }}
            />
          </div>
          <div className={`hover:bg-white rounded-xl ${isSelected("Ellipse") ? "bg-white" : ""}`}>
            <Geometry
              name="Ellipse"
              onClick={() => {
                shapeStore.setSelectedShape("Ellipse");
              }}
            />
          </div>
          <div className={`hover:bg-white rounded-xl ${isSelected("Polyline") ? "bg-white" : ""}`}>
            <Geometry
              name="Polyline"
              onClick={() => {
                shapeStore.setSelectedShape("Polyline");
              }}
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl py-3 ms-8 bg-gray-200 hover:bg-white">
          <Geometry
            name="Save"
            onClick={() => {
              shapeStore.saveAllEntity();
            }}
          />
        </div>
        <div className="bg-gray-100 rounded-2xl py-3 ms-3 bg-gray-200 hover:bg-white">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileChange} // Handle file selection
            style={{ display: "none" }} // Hide the file input element
          />
          <Geometry
            name="Upload"
            onClick={handleUploadClick} // Trigger file input dialog on click
          />
        </div>
      </div>
    </>
  );
});

export default NavigationBar;
