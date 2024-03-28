"use client";
import Calendar from "@/components/Calendar";
import WeekGrid from "@/components/WeekGrid";
import { useDateContext } from "@/context/DateContext";
import { useState } from "react";

type CreateTaskType = {
  start: number;
  taskDate: Date;
};

export default function Home() {
  return (
    <main className="relative font-[300] flex items-start p-4 gap-4">
      <div className="flex flex-col gap-8 justify-center items-center">
        <Calendar />
      </div>
      <WeekGrid />
    </main>
  );
}
