"use client";
import { useViewContext } from "@/context/ViewContext";
import React, { useState } from "react";

const options: ["Week", "Month", "Year"] = ["Week", "Month", "Year"];
const ViewToggle = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { dispatch } = useViewContext();
  return (
    <div>
      <div className="relative text-sm bg-neutral-100 rounded-md flex items-center gap-4 py-2 px-4">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => {
              setSelectedIndex(index);
              dispatch({
                type: "CHANGE_VIEW",
                payload: {
                  view: option,
                },
              });
            }}
            className="w-16 relative z-[10]"
          >
            {option}
          </button>
        ))}
        <span
          style={{
            left: selectedIndex * 5 + "rem",
            transition: "all 100ms",
          }}
          className="w-20  rounded-md m-2 absolute left-0 bg-neutral-300 h-[75%] "
        ></span>
      </div>
    </div>
  );
};

export default ViewToggle;
