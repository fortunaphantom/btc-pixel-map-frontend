import { add, format, startOfDay, sub } from "date-fns";
import { FC, useEffect, useState } from "react";
import ReactDateTimePicker from "react-tailwindcss-datetimepicker";

const now = new Date();
const start = startOfDay(now);
const end = add(sub(start, { seconds: 1 }), { days: 1 });

declare const customRange: {
  readonly "Custom Range": "Custom Range";
};

const DateRanges: Record<string, [Date, Date]> & Partial<typeof customRange> = {
  "1 hour": [now, add(now, { hours: 1 })],
  "6 hours": [now, add(now, { hours: 6 })],
  "1 Day": [now, add(now, { days: 1 })],
  "3 Days": [now, add(now, { days: 3 })],
  "7 Days": [now, add(now, { days: 7 })],
  "1 Month": [now, add(now, { months: 1 })],
  "3 Month": [now, add(now, { months: 3 })],
  "6 Months": [now, add(now, { months: 6 })],
};

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  setStartTime: (value: number) => void;
  setEndTime: (value: number) => void;
  position?: "top" | "bottom";
};

export const DurationInput: FC<Props> = ({
  setStartTime,
  setEndTime,
  position = "bottom",
}) => {
  const [selectedRange, setSelectedRange] = useState({
    start,
    end,
  });

  function handleApply(startDate: Date, endDate: Date) {
    setSelectedRange({ start: startDate, end: endDate });
  }

  function getUserFriendlyDateRangeString() {
    const formattedSelectedStart = format(
      selectedRange.start,
      "MMM d, yyyy h:mm a",
    );
    const formattedSelectedEnd = format(
      selectedRange.end,
      "MMM d, yyyy h:mm a",
    );
    return `${formattedSelectedStart} to ${formattedSelectedEnd}`;
  }

  useEffect(() => {
    setStartTime(Math.round(selectedRange.start.getTime() / 1000));
    setEndTime(Math.round(selectedRange.end.getTime() / 1000));
  }, [selectedRange, setStartTime, setEndTime]);

  return (
    <div className="relative">
      <ReactDateTimePicker
        ranges={DateRanges}
        start={selectedRange.start}
        end={selectedRange.end}
        years={[new Date().getFullYear(), new Date().getFullYear() + 5]}
        applyCallback={handleApply}
        twelveHoursClock
        displayMaxDate
        smartMode
        classNames={{
          rootContainer: `md:max-w-none${
            position == "top" ? "bottom-full !top-auto" : ""
          }`,
        }}
      >
        <button
          type="button"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
        >
          {getUserFriendlyDateRangeString()}
        </button>
      </ReactDateTimePicker>
    </div>
  );
};
