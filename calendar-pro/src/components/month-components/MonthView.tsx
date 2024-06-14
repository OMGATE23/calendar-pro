import { useDateContext } from "@/context/DateContext";
import { weekDays } from "@/helpers/constansts";
import { getDatesInCurrentMonth, isSameMonth } from "@/helpers/timefunctions";
import React, { useEffect, useState } from "react";
import DayInfo from "./DayInfo";
import { Task, useTaskContext } from "@/context/TaskContext";

const MonthView = () => {
  const { state: dateContext } = useDateContext();
  const { tasksState } = useTaskContext();
  let daysInMonth = getDatesInCurrentMonth(dateContext.displayDate);
  const [showDayInfo, setShowDayInfo] = useState<{ show: boolean; day: Date }>({
    show: false,
    day: daysInMonth[0],
  });
  const [organizedTasks, setOrganizedTasks] = useState<Task[][]>([]);
  function organizeTasksByDate(tasks: Task[], displayDate: Date): Task[][] {
    const displayDateObj = new Date(displayDate);
    const displayYear = displayDateObj.getFullYear();
    const displayMonth = displayDateObj.getMonth();

    const filteredTasks = tasks.filter((task) => {
      const taskDateObj = new Date(task.date);
      return (
        taskDateObj.getFullYear() === displayYear &&
        taskDateObj.getMonth() === displayMonth
      );
    });

    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

    const organizedTasks = Array.from(
      { length: daysInMonth },
      () => [] as Task[]
    );

    filteredTasks.forEach((task) => {
      const taskDateObj = new Date(task.date);
      const taskDay = taskDateObj.getDate();
      organizedTasks[taskDay - 1].push(task);
    });

    return organizedTasks;
  }

  useEffect(() => {
    setOrganizedTasks(
      organizeTasksByDate(tasksState.tasks, dateContext.displayDate)
    );
  }, [tasksState, dateContext]);
  return (
    <div className="h-[90%]">
      <div className=" text-xs p-2 mb-2 grid grid-cols-7 justify-center  items-center">
        {weekDays.map((day) => (
          <div className="uppercase text-neutral-700 justify-self-center">
            {day}
          </div>
        ))}
      </div>
      <div className="border-[0.5px] h-full text-xs border-neutral-200 grid grid-cols-7 grid-auto-rows justify-center  items-center">
        {daysInMonth.map((day, index) => (
          <div
            key={day.getDate() + " " + day.getMonth() + day.getFullYear()}
            onClick={() => {
              setShowDayInfo({ show: true, day: day });
            }}
            className={`${
              isSameMonth(day, dateContext.displayDate)
                ? ""
                : "text-neutral-400"
            }  justify-self-center w-full h-full flex flex-col gap-4 border-[0.5px] pt-2 border-neutral-200 transition-all duration-100`}
          >
            <p className="text-center">{day.getDate()}</p>
            <div className=" mx-4">
              {organizedTasks[day.getDate() - 1] &&
                [...organizedTasks[day.getDate() - 1].slice(0, 3)].map(
                  (task) => (
                    <div className="flex items-center gap-2" key={task.id}>
                      {" "}
                      <div
                        className={`w-2 h-2 rounded-full ${task.colour}`}
                      ></div>{" "}
                      {task.title}
                    </div>
                  )
                )}
              {organizedTasks[day.getDate() - 1] &&
                organizedTasks[day.getDate() - 1].length > 3 && (
                  <button className="text-blue-950 mt-2 ">
                    See more tasks
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
      {showDayInfo.show && (
        <DayInfo
          day={showDayInfo.day}
          tasks={
            organizedTasks[showDayInfo.day.getDate() - 1] || ([] as Task[])
          }
          setDayInfo={setShowDayInfo}
        />
      )}
    </div>
  );
};

export default MonthView;
