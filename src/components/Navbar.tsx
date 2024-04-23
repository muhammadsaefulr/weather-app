import { Bell } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";

export default function Navbar() {


  const dataLink = [
    {
      id: 1,
      link: "/",
      menu: "Kontak",
    },
    {
      id: 2,
      link: "/",
      menu: "Tentang",
    },
  ];

  return (
    <nav className="p-4 flex justify-between text-white">
      <div className="logo">
        <h2 className="text-md font-bold text-2xl text-white">HalloWeather</h2>
      </div>
      <div className="menu flex space-x-3 pt-2">
        {dataLink.map((data) => (
          <a key={data.id} href={data.link}>
            <p className="text-white">{data.menu}</p>
          </a>
        ))}
        <div className="pt-1">
          <Bell />
        </div>
      </div>
    </nav>
  );
}
