import { Task } from "@/context/TaskContext";
import { MONTHS } from "@/helpers/constansts";
import { numberToTime } from "@/helpers/timefunctions";
import React, { useEffect, useRef } from "react";

const DayInfo = ({
  day,
  setDayInfo,
  tasks,
}: {
  day: Date;
  setDayInfo: React.Dispatch<
    React.SetStateAction<{ day: Date; show: boolean }>
  >;
  tasks: Task[];
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setDayInfo({ day: day, show: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="backdrop fixed top-0 left-0 w-[100dvw] flex items-center justify-center h-[100dvh] bg-[rgba(0,0,0,0.2)]">
      <div
        ref={modalRef}
        className="h-[60%] flex flex-col gap-6 modal p-8 rounded-md pop-in z-[999999000] md:w-[30%] bg-white"
      >
        <div>
          <p className="text-3xl text-neutral-800 font-semibold">
            {day.getDate()}
          </p>
          <p>
            {" "}
            {MONTHS[day.getMonth()]} {day.getFullYear()}
          </p>
        </div>
        <p className="font-[500] ">{tasks.length} tasks</p>
        <div className="flex flex-col gap-4 overflow-y-scroll">
          {tasks.map((task) => (
            <div
              className={`rounded-md px-4 py-2 text-white ${task.colour} shadow-sm`}
              key={task.id}
            >
              <p className=" font-[500]">{task.title}</p>
              <p className="text-sm">
                {numberToTime(task.startTime)} to {numberToTime(task.endTime)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayInfo;
