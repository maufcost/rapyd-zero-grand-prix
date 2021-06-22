import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { data } from './data.js';

export default function App() {
	//{/* 300 -> 420*/}
  return (
    <LineChart
      width={420}
      height={180}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: -15
      }}
	  className='graph'
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={false} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="Sales"
        stroke="#73e686"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="Date" stroke="#034dbe" />
    </LineChart>
  );
}
