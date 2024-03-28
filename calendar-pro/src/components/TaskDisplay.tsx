import { Task, useTaskContext } from "@/context/TaskContext";
import { useEffect, useRef, useState } from "react";
import { StructuredTaskType } from "./DayView";
import throttle, { formatDate, numberToTime } from "@/helpers/timefunctions";

type TimeType = {
  start: number;
  end: number;
};
const TaskDisplay = ({ task }: { task: StructuredTaskType }) => {
  const refBottom = useRef<HTMLDivElement | null>(null);
  const refDrag = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(task.startTime);
  const [prevClientY, setPrevClientY] = useState(0);
  const [mouseMoving, setMouseMoving] = useState(false);
  const [sliderY, setSliderY] = useState(0);
  const [addedHeight, setAddedHeight] = useState(0);
  const [sliderMoving, setSliderMoving] = useState(false);
  const { tasksState, taskDispatch } = useTaskContext();
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        setMouseMoving(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setAddedHeight(0);
  }, [task.endTime]);
  return (
    <div
      task-date={task.date.getDate()}
      task-month={task.date.getMonth()}
      task-year={task.date.getFullYear()}
      id={task.id}
      key={task.id}
      ref={ref}
      className={`resizeable shadow-md  rounded-md`}
      style={{
        position: "absolute",
        top: top * (16 / 15) + "px",
        height: `${
          ((task.endTime - task.startTime) * 16) / 15 + addedHeight
        }px`,
        marginLeft:
          mouseMoving || sliderMoving ? "0px" : `${task.hallNumber * 20}px`,
        left: "0",
        width:
          mouseMoving || sliderMoving
            ? "100%"
            : `calc(80% - ${task.hallNumber * 20}px)`,
        zIndex: mouseMoving || sliderMoving ? 20 : 10,
      }}
    >
      <div
        ref={refDrag}
        onMouseDown={(event) => {
          setMouseMoving(true);
          setPrevClientY(event.clientY);
        }}
        onMouseLeave={(event) => {
          if (!mouseMoving) return;
          let newTop = Math.ceil(top / 15) * 15;
          setTop(newTop);
          taskDispatch({
            type: "UPDATE_TIME",
            payload: {
              id: task.id,
              startTime: newTop,
              endTime: task.endTime - task.startTime + newTop,
            },
          });
        }}
        onMouseMove={(event) => {
          if (mouseMoving) {
            const dy = event.clientY - prevClientY;
            setTop(task.startTime + dy);

            if (refDrag.current) {
              const component = refDrag.current.getBoundingClientRect();
              let cursorX = event.clientX;
              let left = component.left;
              let right = component.right;
              if (cursorX < left) {
                let newDate = new Date(task.date);
                newDate.setDate(newDate.getDate() - 1);
                taskDispatch({
                  type: "UPDATE_DATE",
                  payload: {
                    id: task.id,
                    newDate: newDate,
                    oldDate: task.date,
                    top,
                  },
                });
                setMouseMoving(false);
              }

              if (cursorX > right) {
                let newDate = new Date(task.date);
                newDate.setDate(newDate.getDate() + 1);
                taskDispatch({
                  type: "UPDATE_DATE",
                  payload: {
                    id: task.id,
                    newDate: newDate,
                    oldDate: task.date,
                    top,
                  },
                });
                setMouseMoving(false);
              }
            }
          }
        }}
        onMouseUp={() => {
          setMouseMoving(false);
          let newTop = Math.floor(top / 15) * 15;
          setTop(newTop);
          taskDispatch({
            type: "UPDATE_TIME",
            payload: {
              id: task.id,
              startTime: newTop,
              endTime: task.endTime - task.startTime + newTop,
            },
          });
        }}
        id="content"
        className="text-xs p-1 outline outline-1 outline-blue-800 relative rounded-md h-full w-full bg-blue-400  shadow-xl text-white"
      >
        <div className="overflow-hidden h-full">
          <p className="text-clip">{task.title}</p>
          <p className="text-clip">
            {numberToTime(task.startTime)} - {numberToTime(task.endTime)}
          </p>
        </div>
        {mouseMoving && (
          <div className="h-[100vh] w-[300%] translate-y-[-50%] translate-x-[-33%] absolute top-0 left-0 outline outline-1"></div>
        )}
      </div>
      <div
        className="resizer-b bg-blue-600 rounded-b-md"
        style={{
          height: "4px",
        }}
        onMouseDown={(event) => {
          setSliderMoving(true);
          setSliderY(event.clientY);
        }}
        onMouseMove={(event) => {
          if (sliderMoving) {
            const dy = event.clientY - sliderY;
            setAddedHeight(dy);
          }
        }}
        onMouseUp={() => {
          let addedMinutes = Math.floor(addedHeight / 15) * 15;

          taskDispatch({
            type: "UPDATE_TIME",
            payload: {
              id: task.id,
              startTime: task.startTime,
              endTime: task.endTime + addedMinutes,
            },
          });

          setSliderMoving(false);
        }}
        onMouseLeave={() => {
          if (!sliderMoving) return;
          let addedMinutes = Math.floor(addedHeight / 15) * 15;

          taskDispatch({
            type: "UPDATE_TIME",
            payload: {
              id: task.id,
              startTime: task.startTime,
              endTime: task.endTime + addedMinutes,
            },
          });
          setSliderMoving(false);
        }}
      >
        {sliderMoving && (
          <div className="h-[100px] relative translate-y-[-50%] "></div>
        )}
      </div>
    </div>
  );
};
export default TaskDisplay;
