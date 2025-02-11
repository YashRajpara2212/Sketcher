import  {useState} from 'react';

const ColorComponent = () => {
    
        const [rgbColor, setRgbColor] = useState({ r: 0, g: 0, b: 0 });
      
        // Function to convert hex to RGB
        const hexToRgb = (hex) => {
          hex = hex.replace('#', '');
          let r = parseInt(hex.substring(0, 2), 16);
          let g = parseInt(hex.substring(2, 4), 16);
          let b = parseInt(hex.substring(4, 6), 16);
          return { r, g, b };
        };
      
        const handleColorChange = (event) => {
          const hexColor = event.target.value;
          const rgb = hexToRgb(hexColor);
          setRgbColor(rgb);
        };
      
  
  return (
    <><div className="flex mt-2 gap-5">
      <div><input type="color" onChange={handleColorChange} /></div>
      <div > RGB: ({rgbColor.r}, {rgbColor.g},{rgbColor.b})</div>
      </div>
    </>
  );
};

export default ColorComponent;
