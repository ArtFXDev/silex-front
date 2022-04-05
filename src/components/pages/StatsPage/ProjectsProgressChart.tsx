/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "style/colors";
import { theme } from "style/theme";
import { getColorFromString } from "utils/color";
import { dateDiffDays } from "utils/date";
import { zouAPIURL } from "utils/zou";

const PROJECTS = gql`
  query projects {
    projects {
      id
      name

      start_date
      end_date
      total_frames
    }
  }
`;

type ProgressData = {
  projects: { [project: string]: { total: number; progress: number } };
  date: number;
};

type ProjectsQuery = {
  projects: {
    name: string;
    start_date: string;
    end_date: string;
    total_frames: number;
  }[];
};

const ProjectsProgressChart = (): JSX.Element => {
  const [data, setData] = useState<ProgressData[]>();

  useEffect(() => {
    axios
      .get<ProgressData[]>(zouAPIURL("data/projects/progress?trunc_key=day"))
      .then((response) => {
        setData(response.data);
      });
  }, []);

  const projectsQuery = useQuery<ProjectsQuery>(PROJECTS, {
    fetchPolicy: "no-cache",
  });

  if (!data || !projectsQuery.data) {
    return <p>Loading...</p>;
  }

  const minDate = Math.min(
    ...projectsQuery.data.projects.map((p) => new Date(p.start_date).getTime())
  );
  const maxDate = Math.max(
    ...projectsQuery.data.projects.map((p) => new Date(p.end_date).getTime())
  );

  const totalFrames = projectsQuery.data.projects
    .map((p) => p.total_frames)
    .reduce((a, b) => a + b, 0);

  const totalProgressFrames = Object.values(data[data.length - 1].projects)
    .map((s) => s.total)
    .reduce((a, b) => a + b, 0);

  const daysFromDeadline = dateDiffDays(new Date(), new Date(maxDate));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" style={{ marginLeft: 50 }}>
          Global project progression
        </Typography>

        <div
          style={{
            border: "1px solid grey",
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            gap: 15,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {/* End date info */}
          <p>
            Deadline :{" "}
            <span style={{ color: theme.palette.warning.main }}>
              {new Date(maxDate).toLocaleDateString("en-US")} (
              {daysFromDeadline}d {daysFromDeadline >= 0 ? "left" : "late"})
            </span>
          </p>

          {/* Total frames */}
          {data && data.length !== 0 && (
            <p>
              Total progress :
              <span
                style={{
                  backgroundColor: COLORS.silexGreen,
                  color: "white",
                  borderRadius: 10,
                  marginLeft: 10,
                  padding: 8,
                }}
              >
                {totalProgressFrames} / {totalFrames}
              </span>
            </p>
          )}
        </div>
      </div>

      <div style={{ width: "80vw", height: "550px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={800}
            height={500}
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              type="number"
              scale="linear"
              interval="preserveStartEnd"
              domain={[minDate, maxDate]}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US")
              }
              height={50}
              label={{
                value: "Time",
                position: "insideBottom",
              }}
            />

            <YAxis
              type="number"
              domain={[0, 1]}
              tickFormatter={(value) => `${value * 100}%`}
              label={{
                value: "% of frames rendered",
                angle: "-90",
                position: "insideLeft",
                textAnchor: "middle",
              }}
            />

            {projectsQuery.data.projects.map((project) => (
              <Line
                type="linear"
                key={project.name}
                dataKey={(data) => {
                  const sample = data.projects[project.name];
                  return sample ? sample.progress : undefined;
                }}
                name={project.name}
                strokeWidth={3}
                dot={false}
                connectNulls
                stroke={getColorFromString(project.name)}
              />
            ))}

            <Tooltip
              formatter={(p: number, value: string) => {
                const project = projectsQuery.data?.projects.find(
                  (pr) => pr.name === value
                );
                if (!project) return "";
                return `${Math.round(p * project.total_frames)} / ${
                  project.total_frames
                } frames`;
              }}
              labelFormatter={(d) => new Date(d).toLocaleDateString("en-US")}
            />

            <Legend wrapperStyle={{ fontSize: 14 }} />

            <ReferenceLine
              x={maxDate}
              stroke="rgba(255, 0, 0)"
              strokeDasharray="3 3"
            />

            <ReferenceLine
              label="Goal"
              stroke="red"
              strokeDasharray="3 3"
              segment={[
                { x: minDate, y: 0 },
                { x: maxDate, y: 1 },
              ]}
              ifOverflow="extendDomain"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectsProgressChart;
