"use client";
import { dateFromFormatDate, formatDate } from "@/helpers/timefunctions";
import React, { ReactNode, createContext, useContext, useReducer } from "react";

export type Task = {
  title: string;
  description?: string;
  date: Date;
  startTime: number;
  endTime: number;
  id: string;
};

export type TaskState = {
  tasksByDate: Map<string, string[]>;
  tasks: Map<string, Task>;
};

export type TaskContextType = {
  tasksState: TaskState;
  taskDispatch: React.Dispatch<Action>;
};

export type Action =
  | {
      type: "ADD_TASK";
      payload: {
        title: string;
        description?: string;
        date: Date;
        startTime: number;
        endTime: number;
      };
    }
  | {
      type: "REMOVE_TASK";
      payload: {
        id: string;
      };
    }
  | {
      type: "UPDATE_TIME";
      payload: {
        id: string;
        startTime: number;
        endTime: number;
      };
    }
  | {
      type: "UPDATE_DATE";
      payload: {
        id: string;
        newDate: Date;
        oldDate: Date;
        top: number;
      };
    };

export const TaskContext = createContext<TaskContextType>({
  tasksState: {
    tasksByDate: new Map(),
    tasks: new Map(),
  },
  taskDispatch: () => {},
});

export function useTaskContext() {
  return useContext(TaskContext);
}
const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasksState, taskDispatch] = useReducer(reducer, {
    tasks: new Map(),
    tasksByDate: new Map(),
  });

  function reducer(state: TaskState, action: Action): TaskState {
    switch (action.type) {
      case "ADD_TASK": {
        const { payload: task } = action;
        const { date } = task;
        const dateString = date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "");

        let newtasksByDate = new Map(state.tasksByDate);
        let newtasks = new Map(state.tasks);
        let newId = crypto.randomUUID();

        newtasksByDate.set(
          dateString,
          [newId].concat(newtasksByDate.get(dateString) || [])
        );
        newtasks.set(newId, {
          ...task,
          description: task.description || "",
          id: newId,
        } as Task);

        return {
          tasksByDate: newtasksByDate,
          tasks: newtasks,
        };
      }

      case "REMOVE_TASK": {
        const { id: toBeDeletedId } = action.payload;
        const task = state.tasks.get(toBeDeletedId);
        if (!task) {
          return state;
        }
        const dateString = task.date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "");
        let newtasksByDate = new Map(state.tasksByDate);
        let newtasks = new Map(state.tasks);
        newtasksByDate.set(dateString, [
          ...state.tasksByDate.get(dateString)?.filter((id) => {
            id !== toBeDeletedId;
          })!,
        ]);
        newtasks.delete(toBeDeletedId);

        return {
          tasksByDate: newtasksByDate,
          tasks: newtasks,
        };
      }

      case "UPDATE_TIME": {
        const { id, startTime, endTime } = action.payload;
        const newTasks = new Map(state.tasks);
        let updatedTask = newTasks.get(id);
        if (!updatedTask) {
          return state;
        }
        updatedTask.startTime = startTime;
        updatedTask.endTime = endTime;

        if (endTime <= startTime) {
          updatedTask.endTime = updatedTask.startTime + 15;
        }
        newTasks.set(id, { ...updatedTask });
        return {
          ...state,
          tasks: newTasks,
        };
      }
      // case "UPDATE_DATE": {
      //   const { id, newDate } = action.payload;
      //   const newTasks = new Map(state.tasks);
      //   let updatedTask = newTasks.get(id);
      //   if (!updatedTask) {
      //     return state;
      //   }
      //   let dateString = formatDate(newDate);
      //   let newTasksByDate = new Map(state.tasksByDate);
      //   newTasks.delete(id);
      //   newTasks.set(id, { ...updatedTask, date: newDate });
      //   newTasksByDate.set(formatDate(updatedTask.date), [
      //     ...(newTasksByDate.get(formatDate(updatedTask.date)) || []).filter(
      //       (taskId) => taskId !== id
      //     ),
      //   ]);
      //   newTasksByDate.set(dateString, [
      //     ...(newTasksByDate.get(dateString) || []),
      //     id,
      //   ]);
      //   return {
      //     tasks: newTasks,
      //     tasksByDate: newTasksByDate,
      //   };
      // }
      case "UPDATE_DATE": {
        const { id, newDate, oldDate, top } = action.payload;

        const newTasks = new Map(state.tasks);
        const newTasksByDate = new Map(state.tasksByDate);

        const taskToUpdate = newTasks.get(id);
        if (!taskToUpdate) {
          return state;
        }

        const oldDateKey = formatDate(oldDate);
        const oldDateTasks = newTasksByDate.get(oldDateKey) || [];
        const updatedOldDateTasks = oldDateTasks.filter(
          (taskId) => taskId !== id
        );
        if (updatedOldDateTasks.length === 0) {
          newTasksByDate.delete(oldDateKey);
        } else {
          newTasksByDate.set(oldDateKey, updatedOldDateTasks);
        }
        let timeDiff = taskToUpdate.endTime - taskToUpdate.startTime;
        let newStart = (top * 15) / 16;

        taskToUpdate.date = newDate;
        taskToUpdate.startTime = Math.ceil(top / 16) * 15;
        taskToUpdate.endTime = taskToUpdate.startTime + timeDiff;
        const newDateKey = formatDate(newDate);
        const newDateTasks = newTasksByDate.get(newDateKey) || [];
        newTasksByDate.set(newDateKey, [...newDateTasks, id]);
        newTasks.set(id, taskToUpdate);

        return {
          tasks: newTasks,
          tasksByDate: newTasksByDate,
        };
      }

      default:
        return state;
    }
  }
  return (
    <TaskContext.Provider value={{ tasksState, taskDispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
