/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import { Chip, Typography, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
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

const EXCLUDE_PROJECTS = ["TEST_PIPE", "TEST_PIPE_2", "ACHROMATIC"];
const START_DATE = new Date(new Date().getFullYear(), 0, 1).getTime();
const AVG_KEY = "AVERAGE";

const ProjectsProgressChart = (): JSX.Element => {
  const [data, setData] = useState<ProgressData[]>();
  const [selectedProject, setSelectedProject] = useState<string>();

  const mdBreakPoint = useMediaQuery(theme.breakpoints.up("xl"));

  useEffect(() => {
    axios
      .get<ProgressData[]>(
        zouAPIURL(`data/projects/progress?trunc_key=day&average_key=${AVG_KEY}`)
      )
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

  if (data.length === 0) {
    return <p>No validation data...</p>;
  }

  const projects = projectsQuery.data.projects
    .filter((p) => !EXCLUDE_PROJECTS.includes(p.name))
    .sort((a, b) => {
      const last = data[data.length - 1];

      const ap = last.projects[a.name];
      const bp = last.projects[b.name];

      if (ap && bp) {
        return bp.progress - ap.progress;
      } else if (!ap) {
        return 1;
      }

      return -1;
    });

  const minDate = Math.min(
    ...projects.map((p) => new Date(p.start_date).getTime())
  );
  const maxDate = Math.max(
    ...projects.map((p) => new Date(p.end_date).getTime())
  );

  const totalFrames = projects
    .map((p) => p.total_frames)
    .reduce((a, b) => a + b, 0);

  const lastSample = data[data.length - 1];

  const totalProgressFrames = Object.keys(lastSample.projects)
    .map((k) => (k === AVG_KEY ? 0 : lastSample.projects[k].total))
    .reduce((a, b) => a + b, 0);

  const daysFromDeadline = dateDiffDays(new Date(), new Date(maxDate));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginRight: 15,
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

      <div style={{ width: mdBreakPoint ? "80vw" : "95vw", height: "550px" }}>
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

            {projects
              .filter((p) =>
                selectedProject ? selectedProject === p.name : true
              )
              .map((project) => (
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

            <Line
              type="linear"
              dataKey={(data) => data.projects[AVG_KEY].progress}
              name="average"
              strokeWidth={3}
              dot={false}
              connectNulls
              stroke="#e8423b"
            />

            <Tooltip
              formatter={(p: number, value: string) => {
                const project = projectsQuery.data?.projects.find(
                  (pr) => pr.name === value
                );

                const totalFramesProject = project
                  ? project.total_frames
                  : totalFrames;
                const frames = Math.floor(p * totalFramesProject);

                return `${frames} / ${totalFramesProject} frames (${Math.round(
                  p * 100
                )}%)`;
              }}
              labelFormatter={(d) => new Date(d).toLocaleDateString("en-US")}
            />

            <ReferenceLine
              x={maxDate}
              stroke="rgba(255, 0, 0)"
              strokeDasharray="3 3"
            />

            <ReferenceLine
              label="Goal"
              stroke="red"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              segment={[
                { x: START_DATE, y: 0 },
                { x: maxDate, y: 1 },
              ]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        {projects.map((p) => {
          const projectColor = getColorFromString(p.name);
          const selected = selectedProject === p.name;
          const color = selected ? projectColor : alpha(projectColor, 0.3);

          return (
            <Chip
              key={p.name}
              label={p.name}
              variant="outlined"
              sx={{
                color,
                borderColor: color,
                backgroundColor: selected ? alpha(projectColor, 0.2) : "",
              }}
              onClick={() => {
                if (selectedProject === p.name) {
                  setSelectedProject(undefined);
                } else {
                  setSelectedProject(p.name);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsProgressChart;
