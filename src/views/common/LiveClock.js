import React, { useState, useEffect } from "react";

export default function LiveClock({ utcOffset = 0 }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timerID); // Cleanup the interval on unmount
  }, []);

  // Adjust time to the provided UTC offset
  const getAdjustedTime = (date, offset) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Convert to UTC
    return new Date(utc + offset * 60 * 60000); // Add offset in hours
  };

  const adjustedDate = getAdjustedTime(date, utcOffset);

  // Format Day, Month, Year, and Time
  const day = adjustedDate.toLocaleDateString("id-ID", { weekday: "long" });
  const month = adjustedDate.toLocaleDateString("id-ID", { month: "long" });
  const year = adjustedDate.getFullYear();
  const time = adjustedDate.toLocaleTimeString("id-ID", { hour12: false }); // 24-hour format

  return (
    <>
      {day}, {adjustedDate.getDate()} {month} {year} : {time}
    </>
  );
}
