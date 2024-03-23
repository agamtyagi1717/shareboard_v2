"use client";

import React from "react";
import { ModeToggle } from "./ui/ThemeToggleButton";

const Navbar = () => {
  return (
    <header>
      <nav className="px-3 py-4 border-[1px] rounded-lg m-2 flex justify-between">
        <h1 className="text-3xl font-bold">ShareBoard</h1>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
