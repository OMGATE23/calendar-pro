import { useTaskContext } from "@/context/TaskContext";
import { useEffect, useRef, useState } from "react";
import { StructuredTaskType } from "./DayView";
import { numberToTime } from "@/helpers/timefunctions";

const TaskDisplay = ({
  task,
  dayNumber,
}: {
  task: StructuredTaskType;
  dayNumber: number;
}) => {
  const refDrag = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(task.startTime);
  const [prevClientY, setPrevClientY] = useState(0);
  const [mouseMoving, setMouseMoving] = useState(false);
  const [sliderY, setSliderY] = useState(0);
  const [addedHeight, setAddedHeight] = useState(0);
  const [sliderMoving, setSliderMoving] = useState(false);
  const { taskDispatch } = useTaskContext();
  const [prevClientX, setPrevClientX] = useState(0);
  const [left, setLeft] = useState(0);
  const [mouseUp, setMouseUp] = useState(false);

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
      className={`task-animation resizeable shadow-md ${task.colour} rounded-md`}
      style={{
        position: "absolute",
        top: top * (16 / 15) + "px",
        height: `${
          ((task.endTime - task.startTime) * 16) / 15 + addedHeight
        }px`,
        marginLeft:
          mouseMoving || sliderMoving ? "0px" : `${task.hallNumber * 20}px`,
        left: left + "px",
        width:
          mouseMoving || sliderMoving
            ? "100%"
            : `calc(80% - ${task.hallNumber * 20}px)`,
        zIndex: mouseMoving || sliderMoving ? 20 : 10,
        display: mouseUp ? "none" : "block",
      }}
    >
      <div
        ref={refDrag}
        onMouseDown={(event) => {
          setMouseMoving(true);
          setPrevClientY(event.clientY);
          setPrevClientX(event.clientX);
        }}
        onMouseLeave={() => {
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
            setTop(Math.max(task.startTime + dy, 0));
            setLeft(
              Math.min(
                Math.max(event.clientX - prevClientX, -dayNumber * 128),
                (6 - dayNumber) * 128
              )
            );
          }
        }}
        onMouseUp={() => {
          setMouseMoving(false);

          let newTop = Math.floor(top / 15) * 15;

          let dateOffset = 0;
          if (Math.abs(left) > 64) {
            dateOffset =
              left < 0
                ? 0.5 * Math.floor(left / 64)
                : 0.5 * Math.ceil(left / 64);
          }

          if (dateOffset !== 0) {
            let newDate = new Date(task.date);

            newDate.setDate(newDate.getDate() + dateOffset);
            setMouseUp(true);
            taskDispatch({
              type: "UPDATE_DATE",
              payload: {
                id: task.id,
                startTime: newTop,
                endTime: task.endTime - task.startTime + newTop,
                oldDate: task.date,
                newDate: newDate,
              },
            });
          } else {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                startTime: newTop,
                endTime: task.endTime - task.startTime + newTop,
              },
            });
          }
          setTop(newTop);
          setLeft(0);
        }}
        id="content"
        className="text-xs font-[500] p-1  relative rounded-md h-full w-full  shadow-xl text-white"
      >
        <div className="overflow-hidden select-none h-full">
          <p className="text-clip">{task.title}</p>
          <p className="text-clip">
            {numberToTime(task.startTime)} - {numberToTime(task.endTime)}
          </p>
        </div>
        {mouseMoving && (
          <div className="h-[100vh] w-[300%] translate-y-[-50%] translate-x-[-33%] absolute top-0 left-0"></div>
        )}
      </div>
      <div
        className="resizer-b rounded-b-md"
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
