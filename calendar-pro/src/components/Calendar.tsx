"use client";

import { useDateContext } from "@/context/DateContext";
import { MONTHS } from "../helpers/constansts";

export default function Calendar() {
  let { state, dispatch } = useDateContext();
  let displayDate = state.displayDate;
  let selectedDate = state.selectedDate;
  let days = getDatesInCurrentMonth();

  function previousMonthHandler() {
    let newDate = new Date(displayDate);
    newDate.setMonth(displayDate.getMonth() - 1);

    dispatch({
      type: "DISPLAY_DATE",
      payload: {
        displayDate: newDate,
      },
    });
  }

  function nextMonthHandler() {
    let newDate = new Date(displayDate);
    newDate.setMonth(displayDate.getMonth() + 1);

    dispatch({
      type: "DISPLAY_DATE",
      payload: {
        displayDate: newDate,
      },
    });
  }
  function getDatesInCurrentMonth(): Array<Date> {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    let firstDay = new Date(year, month, 1);
    let firstDayPrevWeek = new Date(year, month, 1 - firstDay.getDay());

    let lastDay = new Date(year, month + 1, 0);
    let lastDayNextWeek = new Date(year, month + 1, 6 - lastDay.getDay());
    const datesArray = [];
    let curr = new Date(firstDayPrevWeek);
    while (curr <= lastDayNextWeek) {
      datesArray.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return datesArray;
  }
  function isSameMonth(date: Date) {
    return date.getMonth() === displayDate.getMonth();
  }
  function areDatesEqual(date1: Date, date2: Date) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
    return year1 === year2 && month1 === month2 && day1 === day2;
  }
  return (
    <div className="h-fit w-fit flex flex-col items-center gap-2 ">
      <div className="flex items-center justify-between w-full pl-2">
        <h1
          onClick={() => {
            days[0].getDay;
          }}
          className="text-lg font-semibold"
        >
          {MONTHS[displayDate.getMonth()]}, {displayDate.getFullYear()}
        </h1>
        <div>
          <button onClick={previousMonthHandler}>
            <img className="w-6" src="/assets/icons/chevronLeft.svg" />
          </button>
          <button onClick={nextMonthHandler}>
            <img className="w-6" src="/assets/icons/chevronRight.svg" />
          </button>
        </div>
      </div>
      <div className="grid grid-date-header text-xs justify-center items-center ">
        <div className="font-semibold">S</div>
        <div className="font-semibold">M</div>
        <div className="font-semibold">T</div>
        <div className="font-semibold">W</div>
        <div className="font-semibold">T</div>
        <div className="font-semibold">F</div>
        <div className="font-semibold">S</div>
      </div>
      <div className="calendar text-xs justify-center items-center">
        {days.map((date) => (
          <button
            key={date.getTime()}
            onClick={() => {
              dispatch({
                type: "SELECTED_DATE",
                payload: {
                  selectedDate: date,
                },
              });
            }}
            className={`day ${
              !isSameMonth(date) && "text-gray-400"
            } mx-auto items-center justify-items-center  rounded-md w-6 h-6  justify-center ${
              areDatesEqual(date, selectedDate)
                ? "bg-black text-white  hover:bg-black"
                : "hover:bg-gray-100"
            }`}
          >
            <time
              dateTime={`${date.getDate}-${
                date.getMonth() + 1
              }-${date.getFullYear()}`}
            >
              {date.getDate()}
            </time>
          </button>
        ))}
      </div>
    </div>
  );
}
