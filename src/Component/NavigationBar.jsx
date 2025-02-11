
// eslint-disable-next-line no-unused-vars
import React from 'react'
import Geometry from './Geometry'

const NavigationBar = () => {
  return (
    <><div className="container flex text-2xl">
      <div className=" flex bg-gray-100 rounded-2xl py-3 px-3 ms-10">
        <div><Geometry name = "Line" /></div>
        <div><Geometry name="Circle" /></div>
        <div><Geometry name="Ellipse" /></div>
        <div><Geometry name="Polyline" /></div>
      </div>
      <div className="bg-gray-100 rounded-2xl py-3 ms-8"><Geometry name="Save" /></div>
      <div className="bg-gray-100 rounded-2xl py-3 ms-3"><Geometry name="Upload" /></div>
      </div>
    </>
  )
}

export default NavigationBar
