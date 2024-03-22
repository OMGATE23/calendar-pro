import { Task, useTaskContext } from "@/context/TaskContext";
import { formatDate } from "@/helpers/timefunctions";
import React from "react";
import TaskDisplay from "./TaskDisplay";
import { CreateTaskType } from "./WeekGrid";
import { StructuredTaskType } from "./DayView";
import TaskComponent from "./TaskComponent";

type TimeBoxProps = {
  timeInterval: {
    start: number;
    end: number;
  };
  day: Date;
  setCreateTaskData: React.Dispatch<React.SetStateAction<CreateTaskType>>;
  setShowCreateTask: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: StructuredTaskType[];
};

const TimeBox = ({
  setCreateTaskData,
  setShowCreateTask,
  timeInterval,
  day,
  tasks,
}: TimeBoxProps) => {
  return (
    <>
      <div
        data-type="timebox"
        data-date={day.getDate()}
        data-month={day.getMonth()}
        data-year={day.getFullYear()}
        onClick={(e) => {
          const nativeElement = e.nativeEvent.target as HTMLElement;
          if (nativeElement.getAttribute("data-type") !== "timebox") {
            return;
          }
          setCreateTaskData({
            taskDate: day,
            start: timeInterval.start,
          });
          setShowCreateTask(true);
        }}
        className={`h-4 timebox ${
          timeInterval.end % 60 === 0 && "border-b-[1px] border-neutral-100 "
        } relative`}
      >
        {tasks.length > 0 &&
          tasks.map((task) => {
            if (task.startTime === timeInterval.start) {
              return (
                <TaskComponent
                  key={task.id}
                  task={task as StructuredTaskType}
                />
              );
            }
          })}
      </div>
    </>
  );
};

export default TimeBox;
