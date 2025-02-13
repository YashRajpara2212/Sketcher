/* eslint-disable react/prop-types */
function InputNumber({ label, value }) {
  return (
    <div className="flex  gap-3 bg-gray-100 my-3 text-xl py-1 me-8 rounded border  border-gray-400 ps-2 ">
      {/* x */}
      {/* y */}

      <div className="w-3">{label}:</div>
      <div className="w-full ">
        <input type="number" className="w-full" placeholder="" value={value} />
      </div>

      {/* <input type="color" name="" id="" /> */}
    </div>
  );
}

export default InputNumber;
