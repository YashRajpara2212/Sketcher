// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import Geometry from "./Geometry";
import { shapeStore } from "../ShapeStore";
import { observer } from "mobx-react";

const NavigationBar = observer(({ setShape, onUpload }) => {
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
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // };
  return (
    <>
      <div className="container absolute left-[26%] w-[50%] top-0 m-5 z-10 flex h-[85px] text-2xl ">
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
          <Geometry
            name="Save"
            onClick={() => {
              shapeStore.saveAllEntity();
            }}
          />
        </div>
        <div className="bg-gray-100 rounded-2xl py-3 ms-3 bg-gray-200">
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
