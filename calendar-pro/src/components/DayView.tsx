import { useDateContext } from "@/context/DateContext";
import { formatDate, sameDate } from "@/helpers/timefunctions";
import React, { useEffect, useState } from "react";
import TimeBox from "./TimeBox";
import { Task, useTaskContext } from "@/context/TaskContext";
import { CreateTaskType } from "./WeekGrid";

export type StructuredTaskType = {
  title: string;
  description?: string;
  date: Date;
  startTime: number;
  endTime: number;
  id: string;
  hallNumber: number;
};

const DayView = ({
  day,
  timeIntervals,
  setCreateTaskData,
  setShowCreateTask,
}: {
  day: Date;
  setCreateTaskData: React.Dispatch<React.SetStateAction<CreateTaskType>>;
  setShowCreateTask: React.Dispatch<React.SetStateAction<boolean>>;
  timeIntervals: {
    start: number;
    end: number;
  }[];
}) => {
  const { state: dateState, dispatch: dateDispatch } = useDateContext();
  const { tasksState } = useTaskContext();
  const [displayTasks, setDisplayTasks] = useState<StructuredTaskType[]>([]);
  const { tasks, tasksByDate } = tasksState;
  function getFormatedTasks() {
    const today = formatDate(day);
    let todaysTasks = tasksByDate.get(today) || [];

    if (todaysTasks.length === 0) {
      return [];
    }
    let sortedTasks = (todaysTasks.filter(Boolean) as string[])
      .map((eventId) => tasks.get(eventId) as Task)
      .sort((a, b) => a.startTime - b.endTime);

    let solution = [];
    for (let task of sortedTasks) {
      let taskScheduled = false;
      for (let hall of solution) {
        if (hall[hall.length - 1].endTime <= task.startTime) {
          hall.push(task);
          taskScheduled = true;
          break;
        }
      }
      if (!taskScheduled) {
        solution.push([task]);
      }
    }
    let structuredTasks: StructuredTaskType[] = [];
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution[i].length; j++) {
        structuredTasks.push({ ...solution[i][j], hallNumber: i });
      }
    }
    return structuredTasks;
  }
  useEffect(() => {
    setDisplayTasks(getFormatedTasks());
  }, [tasks, tasksByDate]);
  return (
    <div className="w-32 outline outline-1 outline-neutral-100">
      <button
        onClick={() => {
          dateDispatch({
            type: "SELECTED_DATE",
            payload: {
              selectedDate: day,
            },
          });
        }}
        className={`${
          sameDate(day, dateState.selectedDate) && "bg-neutral-950 text-white"
        } w-full px-4 py-2 rounded-md`}
      >
        {day.getDate()} , {day.getMonth()}
      </button>
      {timeIntervals.map((interval) => (
        <TimeBox
          setCreateTaskData={setCreateTaskData}
          setShowCreateTask={setShowCreateTask}
          key={interval.end}
          timeInterval={interval}
          day={day}
          tasks={displayTasks}
        />
      ))}
    </div>
  );
};

export default DayView;
