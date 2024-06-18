import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Devices_Charts = ({ selectedDevice_Table }) => {
  let data = []; // Initialize the data array outside JSX

  // Check if selectedDevice_Table exists before initializing data
  if (selectedDevice_Table) {
    // Initialize the data array dynamically using map
    data = selectedDevice_Table.valueLog.map((entry, index) => ({
      name: new Date(entry.time).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      }),
    // name:"DEV",
      [`Value${index + 1}`]: entry.value,
    }));
  }

  // Pad the data array if necessary to ensure it has series1 to series5
//   while (data.length < 5) {
//     data.push({ name: "Value" });
//   }

  // Dynamically generate random colors for bars
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  // Dynamically render Bar components based on the length of selectedDevice_Table.valueLog
  const bars = [];
  if (selectedDevice_Table && selectedDevice_Table.valueLog) {
    for (let index = 0; index < selectedDevice_Table.valueLog.length; index++) {
      bars.push(
        <Bar
          key={`Value${index + 1}`}
          dataKey={`Value${index + 1}`}
          fill={getRandomColor()} // Set random color for each bar
        />
      );
    }
  }

  return (
    <>
      <div>
        <h1>Devices Chart's</h1>
        {selectedDevice_Table && (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={data}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {bars}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default Devices_Charts;
