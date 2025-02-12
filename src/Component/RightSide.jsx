import ButtonComponent from "./ButtonComponent";
import InputNumber from "./InputNumber";
import ColorComponent from "./ColorComponent";

const RightSide = () => {
  const val = 0.01;
  // function getValue() {
  //     return value = 0.01;
  //     setval
  // }
  return (
    <div className="container flex-col absolute right-0 top-0 z-10 m-5  bg-gray-200 mx-3   min-h-screen rounded-xl w-[25%] ">
      <div className="text-2xl mt-3 ps-6 mb-1">Properties:</div>
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
      {/* <div className="ps-6 flex">
        <div className="w-1/6 p-1">
          <input type="color" />
        </div>
        <div className="w-2/3 p-1">RGB()</div>
        <div className="bg-white p-1 w-1/6 me-10">100%</div>
      </div> */}
      <div className="ps-6 text-xl">
        <ColorComponent />
      </div>
      <div className="ps-6">
        <ButtonComponent name="Hide" />
      </div>
      <div className="ps-6">
        <ButtonComponent name="Delete" />
      </div>
    </div>
  );
};

export default RightSide;
