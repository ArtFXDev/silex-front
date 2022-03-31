import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ValidationRecord } from "types/entities";

export const CustomScatterDot = ({
  cx,
  cy,
}: {
  cx: number;
  cy: number;
}): JSX.Element => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={2.5}
      stroke="#82ca9d"
      style={{ opacity: "0.9" }}
      strokeWidth={1}
      fill="#a7daba"
    />
  );
};

interface ValidationHistoryChartProps {
  totalFrames: number;
  validationHistory: ValidationRecord[];
}

const ValidationHistoryChart = ({
  totalFrames,
  validationHistory,
}: ValidationHistoryChartProps): JSX.Element => {
  const data = validationHistory.map((record) => ({
    createdAt: record.created_at,
    value: (record.total / totalFrames) * 100,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 8,
          right: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <defs>
          <linearGradient id="progress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="8%" stopColor="#56aa84" stopOpacity={1.0} />
            <stop offset="95%" stopColor="#56aa84" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="createdAt"
          tick={{ fontSize: 12 }}
          domain={[data[0].createdAt, Date.now()]}
          tickFormatter={(t) =>
            new Date(t)
              .toLocaleDateString("en-US")
              .split("/")
              .slice(0, 2)
              .join("/")
          }
        />

        <YAxis
          tick={{ fontSize: 10 }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
        />

        <Area
          type="linear"
          dataKey="value"
          stroke="#71b797"
          fill="url(#progress)"
        />

        <Line
          type="linear"
          dataKey="value"
          stroke="#82ca9d"
          dot={CustomScatterDot}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ValidationHistoryChart;
