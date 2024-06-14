"use client";
import { useViewContext } from "@/context/ViewContext";
import React from "react";
import WeekGrid from "./day-components/WeekGrid";
import MonthView from "./month-components/MonthView";
import YearView from "./year-components/YearView";

const DisplayView = () => {
  const { state } = useViewContext();

  return (
    <div className="w-full h-full">
      {state.view === "Week" && <WeekGrid />}
      {state.view === "Month" && <MonthView />}
      {state.view === "Year" && <YearView />}
    </div>
  );
};

export default DisplayView;
