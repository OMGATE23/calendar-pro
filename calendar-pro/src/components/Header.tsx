"use client";
import React from "react";
import ViewToggle from "./ViewToggle";
import { useDateContext } from "@/context/DateContext";
import { MONTHS } from "@/helpers/constansts";

const Header = () => {
  const { state } = useDateContext();
  return (
    <div className="flex font-[300]  flex-col border border-neutral-200   justify-between items-center md:flex-row px-8 py-4">
      <h1 className="font-semibold flex text-xl items-center gap-2">
        <img width={32} src="/assets/icons/calendar.png" />
        CalendarPro
      </h1>
      <div className="font-[600] text-xl text-neutral-900">
        {MONTHS[state.displayDate.getMonth()]} {state.displayDate.getFullYear()}
      </div>
      <ViewToggle />
    </div>
  );
};

export default Header;
