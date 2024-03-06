export const formatRemainingInterval = (time: number) => {
  const intervals = {
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(time / seconds);
    if (interval >= 1) {
      return interval === 1 ? `a ${unit}` : `${interval} ${unit}s`;
    }
  }
  return "just now";
};

export const formatTimeInterval = (interval: number): string => {
  const seconds = interval % 60;
  interval = Math.floor(interval / 60);

  const minutes = interval % 60;
  interval = Math.floor(interval / 60);

  const hours = interval % 24;
  const days = Math.floor(interval / 24);

  return `${days.toString().padStart(2, "0")}:${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const timeFormat = (time: string): string => {
  const date = new Date(time); // Multiply by 1000 as JavaScript Date works with milliseconds
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits for minutes

  return `${month} ${day}, ${year} at ${formattedHours}:${formattedMinutes} ${period}`;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
