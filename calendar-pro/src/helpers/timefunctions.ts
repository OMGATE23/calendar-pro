import { Task } from "@/context/TaskContext";

function formattedTime(totalMinutes: number): string {
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export function sameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function addOrSubtractTime(timeNum: number, sign: number): number {
  timeNum += sign * 15;
  return timeNum;
}

type DraggedTaskType = {
  startTime: number;
  endTime: number;
};

export function draggedTaskTimes(
  { startTime, endTime }: DraggedTaskType,
  sign: number
): DraggedTaskType {
  let startTotalMinutes = startTime;
  let endTotalMinutes = endTime;
  startTotalMinutes += sign * 15;
  if (startTotalMinutes < 0) {
    return { startTime, endTime };
  }
  endTotalMinutes += sign * 15;

  return {
    startTime: startTotalMinutes,
    endTime: endTotalMinutes,
  };
}

export function calculateHeight(startTime: string, endTime: string): number {
  let [startHour, startMinutes] = startTime.split(":").map(Number);
  let [endHour, endMinutes] = endTime.split(":").map(Number);
  let end = endHour * 60 + endMinutes;
  let start = startHour * 60 + startMinutes;
  return ((end - start) * 1.75) / 15;
}

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let lastExecuted = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const throttledFunction = (...args: Parameters<T>): void => {
    const now = Date.now();

    if (!lastExecuted || now - lastExecuted >= delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func(...args);
      lastExecuted = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        lastExecuted = Date.now();
        timeout = null;
      }, delay - (now - lastExecuted));
    }
  };

  return throttledFunction as T;
};

export default throttle;

export const calculateDuration = (task: Task): number => {
  const startTime = new Date(`2022-01-01T${task.startTime}`).getTime();
  const endTime = new Date(`2022-01-01T${task.endTime}`).getTime();
  return endTime - startTime;
};
export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}${month}${year}`;
}
