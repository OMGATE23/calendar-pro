import { Task, useTaskContext } from "@/context/TaskContext";
import {
  addOrSubtractTime,
  calculateHeight,
  draggedTaskTimes,
  throttle,
} from "../helpers/timefunctions";
import { useEffect, useRef, useState } from "react";
import { StructuredTaskType } from "./DayView";

export default function TaskComponent({ task }: { task: StructuredTaskType }) {
  const { taskDispatch } = useTaskContext();
  const refBottom = useRef<HTMLDivElement | null>(null);
  const refDrag = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeableEle = ref.current;
    if (resizeableEle) {
      const styles = window.getComputedStyle(resizeableEle);
      let height = parseInt(styles.height, 10);
      let y = 0;

      // Drag and move logic
      const onMouseMoveDrag = (event: MouseEvent) => {
        let taskEl = event.target as HTMLElement;
        if (refDrag.current) {
          refDrag.current.style.cursor = "move";
        }
        const dy = event.clientY - y;
        if (dy >= 28 || dy <= -28) {
          height = height + dy;
          y = event.clientY;
          if (dy > 0) {
            let newTimes = draggedTaskTimes(
              {
                startTime: task.startTime,
                endTime: task.endTime,
              },
              1
            );
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: newTimes.endTime,
                startTime: newTimes.startTime,
              },
            });
          } else {
            let newTimes = draggedTaskTimes(
              {
                startTime: task.startTime,
                endTime: task.endTime,
              },
              -1
            );
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: newTimes.endTime,
                startTime: newTimes.startTime,
              },
            });
          }
        }
      };
      const onMouseUpDrag = () => {
        if (refDrag.current) {
          refDrag.current.style.cursor = "default";
        }
        document.removeEventListener("mousemove", onMouseMoveDrag);
        document.removeEventListener("pointermove", onMouseMoveDrag);
      };

      const onMouseDownDrag = (event: MouseEvent) => {
        y = event.clientY;
        if (refDrag.current) {
          refDrag.current.style.cursor = "move";
        }
        document.addEventListener("mousemove", onMouseMoveDrag);
        document.addEventListener("pointermove", onMouseMoveDrag);
        document.addEventListener("mouseup", onMouseUpDrag);
        document.addEventListener("pointerup", onMouseUpDrag);
      };

      const taskDrag = refDrag.current;
      if (taskDrag) {
        taskDrag.addEventListener("mousedown", onMouseDownDrag);
        taskDrag.addEventListener("pointerdown", onMouseDownDrag);
      }
      // Resize height of the task
    }
  }, []);
  useEffect(() => {
    let resizeableEle = ref.current;
    if (resizeableEle) {
      const styles = window.getComputedStyle(resizeableEle);
      let height = parseInt(styles.height, 10);
      let y = 0;
      const onMouseMoveBottomResize = (event: MouseEvent) => {
        const dy = event.clientY - y;

        if (dy >= 28 || dy <= -28) {
          height = height + dy;
          y = event.clientY;
          if (dy > 0) {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: addOrSubtractTime(task.endTime, 1),
                startTime: task.startTime,
              },
            });
          } else {
            taskDispatch({
              type: "UPDATE_TIME",
              payload: {
                id: task.id,
                endTime: addOrSubtractTime(task.endTime, -1),
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
      ref={ref}
      className="resizeable w-[85%] shadow-md outline outline-1 rounded-md outline-slate-700 z-10"
      style={{
        height: `${((task.startTime - task.endTime) * 8) / 15}px`,
      }}
    >
      <div
        ref={refDrag}
        id="content"
        className=" select-none rounded-md h-full w-full bg-slate-400 text-white overflow-clip"
      >
        <p>{task.title}</p>
        <p>{task.startTime}</p>
        <p>{task.endTime}</p>
      </div>
      <div
        className="resizer-b rounded-b-md bg-slate-500"
        ref={refBottom}
        style={{
          height: "10px",
        }}
      ></div>
    </div>
  );
}
