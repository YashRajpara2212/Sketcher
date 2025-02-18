import "tailwindcss";
import { useState } from "react";
import { observer } from "mobx-react";
import { shapeStore } from "../ShapeStore";
import { FiSearch } from "react-icons/fi";
import ShapeInfoComponent from "./ShapeInfoComponent";

const LeftSide = observer(() => {
  const shapes = shapeStore.shapes;
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(shapes, "all shapes1");

  // Filter shapes based on the search term (only display matching shapes)
  const filteredShapes = shapes.filter(
    (shape) => shape.name.toLowerCase().includes(searchTerm.toLowerCase()) // Check if shape name contains the search term
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term state on input change
  };

  const handleClick = (e) => {
    shapeStore.setEntity(e);
  };

  return (
    <div className=" container absolute left-0 top-0 z-10 m-5  bg-gray-200 mx-3  max-h-[95vh] overflow-auto rounded-xl w-[25%]">
      <div className="flex p-3 justify-between text-2xl">
        <div className="col-10">List Of Created Object</div>
      </div>
      <div className="flex text-xl gap-4">
        <div className=" mt-3 ms-3 text-2xl col-1/5">
          <FiSearch />
        </div>
        {/* Search input */}
        <div className="mb-2 col-4/5">
          <input
            className="col-4/5 w-full px-3 py-2 border rounded-md"
            type="text"
            placeholder="Search for shapes..."
            value={searchTerm}
            onChange={handleSearch} // Call handleSearch function on input change
            // focus:outline-none focus:ring-2 focus:ring-blue-500
          />
        </div>
      </div>
      <hr className="mb-2" />
      <div className="ms-15 me-2 mb-2">
        {searchTerm === "" // Check if the search term is empty
          ? shapes.map(
              (
                e // If empty, show all shapes
              ) => (
                <div key={e.uuid} onClick={(event) => handleClick(e, event)}>
                  <ShapeInfoComponent
                    shapeName={e.name}
                    entityId={e.uuid}
                    shapeNumber={shapeStore.getShapeNumberByNameAndUUID(
                      e.name,
                      e.uuid
                    )}
                  />
                </div>
              )
            )
          : filteredShapes?.map(
              (
                e // Else, show filtered shapes
              ) => (
                <div key={e.uuid} onClick={(event) => handleClick(e, event)}>
                  <ShapeInfoComponent
                    shapeName={e.name}
                    entityId={e.uuid}
                    shapeNumber={shapeStore.getShapeNumberByNameAndUUID(
                      e.name,
                      e.uuid
                    )}
                  />
                </div>
              )
            )}
        {/* {shapes?.map((e) => (
          <div key={e.uuid} onClick={(event) => handleClick(e, event)}>
            <ShapeInfoComponent
              shapeName={e.name}
              entityId={e.uuid}
              shapeNumber={shapeStore.getShapeNumberByNameAndUUID(
                e.name,
                e.uuid
              )}
            />
          </div>
        ))} */}
      </div>
    </div>
  );
});

export default LeftSide;
