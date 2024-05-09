import { useDateContext } from "@/context/DateContext";
import { formatDate, sameDate } from "@/helpers/timefunctions";
import React, { useEffect, useState } from "react";
import TimeBox from "./TimeBox";
import { Task, useTaskContext } from "@/context/TaskContext";
import { CreateTaskType } from "./WeekGrid";
import TaskDisplay from "./TaskDisplay";
import { MONTHS } from "@/helpers/constansts";

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
  dayNumber,
}: {
  day: Date;
  dayNumber: number;
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
      .sort((a, b) => a.startTime - b.startTime);
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
    solution = solution.sort((a, b) => {
      if (a[0].startTime < b[0].startTime) return -1;
      if (a[0].startTime > b[0].startTime) return 1;

      const durationA = a[0].endTime - a[0].startTime;
      const durationB = b[0].endTime - b[0].startTime;

      return durationB - durationA;
    });
    let structuredTasks: StructuredTaskType[] = [];
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution[i].length; j++) {
        structuredTasks.push({ ...solution[i][j], hallNumber: i });
      }
    }
    return structuredTasks;
  }
  useEffect(() => {
    const structuredTasks = getFormatedTasks();
    setDisplayTasks(structuredTasks || []);
  }, [tasks, tasksByDate]);
  return (
    <div className="min-w-32 outline outline-1 outline-neutral-100">
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
        } w-full select-none px-4 py-1 h-16 rounded-md flex flex-col items-center justify-center text-center`}
      >
        {day.getDate()}
        <span>{MONTHS[day.getMonth()]}</span>
      </button>
      <div className="relative">
        {timeIntervals.map((interval) => (
          <TimeBox
            setCreateTaskData={setCreateTaskData}
            setShowCreateTask={setShowCreateTask}
            key={interval.end}
            timeInterval={interval}
            day={day}
          />
        ))}

        {displayTasks.length > 0 &&
          displayTasks.map((task) => (
            <TaskDisplay dayNumber={dayNumber} key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

export default DayView;
