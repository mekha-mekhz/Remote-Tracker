import { useState, useEffect } from "react";

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Convert seconds → hh:mm:ss
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Time Tracker</h2>

      <div className="text-4xl font-mono text-center mb-6">
        {formatTime(seconds)}
      </div>

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Stop
          </button>
        )}

        <button
          onClick={() => setSeconds(0)}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
