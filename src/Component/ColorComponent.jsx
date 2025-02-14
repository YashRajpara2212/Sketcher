import { useEffect, useState } from "react";
import { observer } from "mobx-react";

const ColorComponent = observer(
  ({ value, onColorChange, opacity, setOpacity }) => {
    const [hexColor, setHexColor] = useState(value);

    useEffect(() => {
      setHexColor(value);
    }, [value]);
    // const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });

    const hexToRgb = (hex) => {
      let r = 0,
        g = 0,
        b = 0;
      // 3 digits
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      }
      // 6 digits
      else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
      }
      return { r, g, b };
    };
    // Function to convert hex to RGB
    // const hexToRgb = (hex) => {
    //   hex = hex.replace("#", "");
    //   let r = parseInt(hex.substring(0, 2), 16);
    //   let g = parseInt(hex.substring(2, 4), 16);
    //   let b = parseInt(hex.substring(4, 6), 16);
    //   return { r, g, b };
    // };

    // function rgbToHex(value) {
    //   const { r, g, b } = rgbObject;
    //   const toHex = (val) => {
    //     const hex = val.toString(16);
    //     return hex.length === 1 ? "0" + hex : hex;
    //   };

    //   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    // }

    const handleColorChange = (event) => {
      const newHexColor = event.target.value;
      // const rgb = hexToRgb(hexColor);
      // setRgbColor(rgb);

      setHexColor(newHexColor);
      const { r, g, b } = hexToRgb(newHexColor);
      onColorChange({ r, g, b });
    };

    const handleOpacityChange = (event) => {
      setOpacity(event.target.value);
    };

    return (
      <>
        <div className="text-xl flex  mt-2 gap-5">
          <div className="w-1/5">
            <input type="color" value={hexColor} onChange={handleColorChange} />
          </div>
          <div className="w-1/2">
            RGB: ({hexToRgb(hexColor).r},{hexToRgb(hexColor).g},
            {hexToRgb(hexColor).b})
          </div>
          <div className=" w-1/5 me-8">
            <input
              className="w-4/5 bg-gray-100"
              type="number"
              value={opacity}
              onChange={(event)=>handleOpacityChange(event)}
              min="0"
              max="100"
            />
          </div>
        </div>
      </>
    );
  }
);

export default ColorComponent;
