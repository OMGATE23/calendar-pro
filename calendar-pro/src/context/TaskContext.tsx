"use client";
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
        newTasks.set(id, updatedTask);

        return {
          ...state,
          tasks: newTasks,
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
