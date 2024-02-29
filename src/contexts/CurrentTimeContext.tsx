"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const CurrentTimeContext = createContext<number>(0);

const CurrentTimeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Set up the timeout.
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <CurrentTimeContext.Provider value={currentTime}>
      {children}
    </CurrentTimeContext.Provider>
  );
};

export default CurrentTimeContextProvider;

export function useCurrentTime(): number {
  const context = useContext(CurrentTimeContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useCurrentTime should be used within the CurrentTimeContext provider!",
    );
  }

  return context;
}
