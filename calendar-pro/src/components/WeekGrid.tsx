"use client";
import { useDateContext } from "@/context/DateContext";
import { useTaskContext } from "@/context/TaskContext";
import { sameDate } from "@/helpers/timefunctions";
import React, { useState } from "react";
import TimeBox from "./TimeBox";
import DayView from "./DayView";
import CreateEventModal from "./CreateEventModal";

export type CreateTaskType = {
  start: number;
  taskDate: Date;
};

const WeekGrid = () => {
  const { state: dateState } = useDateContext();
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [createTaskData, setCreateTaskData] = useState<CreateTaskType>({
    start: 0,
    taskDate: dateState.selectedDate,
  });

  const { tasksState } = useTaskContext();

  function getDisplayWeek(): Date[] {
    const dayOfWeek = dateState.displayDate.getDay();
    const daysInSameWeek = [];

    const startingDay = new Date(dateState.displayDate);
    startingDay.setDate(dateState.displayDate.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const newDay = new Date(startingDay);
      newDay.setDate(startingDay.getDate() + i);
      daysInSameWeek.push(newDay);
    }
    return daysInSameWeek;
  }
  function getTimeIntervals() {
    const intervals = [];
    const start = new Date(dateState.displayDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 96; i++) {
      intervals.push({
        start: i * 15,
        end: (i + 1) * 15,
      });
    }

    return intervals;
  }
  let timeIntervals = getTimeIntervals();
  let displayWeek = getDisplayWeek();
  return (
    <>
      <div className="flex items-start min-h-[100dvh] overflow-x-scroll">
        {displayWeek.map((day) => (
          <DayView
            setCreateTaskData={setCreateTaskData}
            setShowCreateTask={setShowCreateTask}
            key={day.getTime()}
            day={day}
            timeIntervals={timeIntervals}
          />
        ))}
      </div>
      {showCreateTask && (
        <CreateEventModal
          setShowCreateTask={setShowCreateTask}
          createTaskData={createTaskData}
        />
      )}
    </>
  );
};

export default WeekGrid;
