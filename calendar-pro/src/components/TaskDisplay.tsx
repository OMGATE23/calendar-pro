import { Task, useTaskContext } from "@/context/TaskContext";
import { memo, useEffect, useRef, useState } from "react";
import { StructuredTaskType } from "./DayView";

type TimeType = {
  start: number;
  end: number;
};
const TaskDisplay = ({ task }: { task: StructuredTaskType }) => {
  const refBottom = useRef<HTMLDivElement | null>(null);
  const refDrag = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [time, setTime] = useState<TimeType>({
    start: task.startTime,
    end: task.endTime,
  });
  const { tasksState, taskDispatch } = useTaskContext();
  console.log(time);
  useEffect(() => {
    const resizeableEle = ref.current;
    if (resizeableEle) {
      let y = 0;
      let tot = 0;
      const onMouseMoveDrag = (event: MouseEvent) => {
        if (refDrag.current) {
          refDrag.current.style.cursor = "move";
        }

        const dy = event.clientY - y;
        if (dy >= 16 || dy <= -16) {
          tot += dy;
          if (dy > 0) {
            setTime((prev) => {
              return {
                start: prev.start + 15,
                end: prev.end + 15,
              };
            });
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: time.end + 15,
                startTime: time.start + 15,
              },
            });
          } else if (dy < 0) {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: time.end - 15,
                startTime: time.start - 15,
              },
            });
            setTime((prev) => {
              return {
                start: prev.start - 15,
                end: prev.end - 15,
              };
            });
          }
        }
      };
      const onMouseUpDrag = () => {
        if (refDrag.current) {
          refDrag.current.style.cursor = "default";
        }
        document.removeEventListener("mousemove", onMouseMoveDrag);
      };

      const onMouseDownDrag = (event: MouseEvent) => {
        y = event.clientY;
        if (refDrag.current) {
          refDrag.current.style.cursor = "move";
        }
        document.addEventListener("mousemove", onMouseMoveDrag);
        document.addEventListener("mouseup", onMouseUpDrag);
      };

      const taskDrag = refDrag.current;
      if (taskDrag) {
        taskDrag.addEventListener("mousedown", onMouseDownDrag);
        taskDrag.addEventListener("pointerdown", onMouseDownDrag);
      }
      // Resize height of the task
    }
  }, [tasksState.tasks]);
  useEffect(() => {
    let resizeableEle = ref.current;
    if (resizeableEle) {
      const styles = window.getComputedStyle(resizeableEle);
      let height = parseInt(styles.height, 10);
      let y = 0;
      let totalDY = 0;
      const onMouseMoveBottomResize = (event: MouseEvent) => {
        const dy = event.clientY - y;

        if (dy >= 16 || dy <= -16) {
          height = height + dy;
          y = event.clientY;
          totalDY += dy;
          if (resizeableEle?.style.height) {
            resizeableEle.style.height = resizeableEle.style.height + totalDY;
          }

          if (dy > 0) {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: task.endTime + 15,
                startTime: task.startTime,
              },
            });
          } else {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime:
                  task.endTime - 15 > task.startTime
                    ? task.endTime - 15
                    : task.endTime,
                startTime: task.startTime,
              },
            });
          }
        }
      };

      const onMouseUpBottomResize = (event: MouseEvent) => {
        document.removeEventListener("mousemove", onMouseMoveBottomResize);
        document.removeEventListener("pointermove", onMouseMoveBottomResize);
      };

      const onMouseDownBottomResize = (event: MouseEvent) => {
        y = event.clientY;
        document.addEventListener("mousemove", onMouseMoveBottomResize);
        document.addEventListener("pointermove", onMouseMoveBottomResize);
        document.addEventListener("mouseup", onMouseUpBottomResize);
        document.addEventListener("pointerup", onMouseDownBottomResize);
      };

      const resizerBottom = refBottom.current;
      if (resizerBottom) {
        resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
        resizerBottom.addEventListener("pointerdown", onMouseDownBottomResize);
      }
    }
  }, []);
  return (
    <div
      task-date={task.date.getDate()}
      task-month={task.date.getMonth()}
      task-year={task.date.getFullYear()}
      id={task.id}
      key={task.id}
      ref={ref}
      className={`resizeable w-full shadow-md  rounded-md  z-10`}
      style={{
        height: `${((task.endTime - task.startTime) * 16) / 15}px`,
        marginLeft: `${task.hallNumber * 20}px`,
      }}
    >
      <div
        ref={refDrag}
        id="content"
        className=" select-none rounded-md h-full w-full bg-blue-400 outline outline-1 outline-blue-500 shadow-xl text-white overflow-clip"
      >
        <p>{task.title}</p>
        <p>{task.startTime}</p>
        <p>{task.endTime}</p>
      </div>
      <div
        className="resizer-b bg-blue-600 rounded-b-md"
        ref={refBottom}
        style={{
          height: "4px",
        }}
      ></div>
    </div>
  );
};

export default TaskDisplay;
