/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import { Chip, Typography, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import CrownAnimation from "components/common/animations/CrownAnimation";
import { useAuth } from "context";
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
import { Project } from "types/entities";
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
      color
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
    color?: string;
  }[];
};

const EXCLUDE_PROJECTS = ["TEST_PIPE", "TEST_PIPE_2", "ACHROMATIC"];
const START_DATE = new Date(new Date().getFullYear(), 0, 1).getTime();
const AVG_KEY = "AVERAGE";

// Create the linear regression function for the curve of the given project
// Stollen from https://blog.oliverjumpertz.dev/simple-linear-regression-theory-math-and-implementation-in-javascript
function linearRegression(
  inputArray: ProgressData[],
  projectName: string = AVG_KEY
) {
  const filteredArray = inputArray.filter(
    (element) => element.projects[projectName]
  );

  const x = filteredArray.map((element) => element.date);
  const y = filteredArray.map(
    (element) => element.projects[projectName].progress
  );

  const sumX = x.reduce((prev, curr) => prev + curr, 0);
  const avgX = sumX / x.length;

  const xDifferencesToAverage = x.map((value) => avgX - value);
  const xDifferencesToAverageSquared = xDifferencesToAverage.map(
    (value) => value ** 2
  );

  const SSxx = xDifferencesToAverageSquared.reduce(
    (prev, curr) => prev + curr,
    0
  );
  const sumY = y.reduce((prev, curr) => prev + curr, 0);
  const avgY = sumY / y.length;
  const yDifferencesToAverage = y.map((value) => avgY - value);

  const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
    (curr, index) => curr * yDifferencesToAverage[index]
  );

  const SSxy = xAndYDifferencesMultiplied.reduce(
    (prev, curr) => prev + curr,
    0
  );

  const slope = SSxy / SSxx;
  const intercept = avgY - slope * avgX;

  //console.log(`${intercept} + ${slope} * x`);

  return (x: number) => intercept + slope * x;
}

const ProjectsProgressChart = (): JSX.Element => {
  const [data, setData] = useState<ProgressData[]>();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const auth = useAuth();
  const userProjects = auth.projects;

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

  const averageProjection = linearRegression(data);

  lastSample.projects["WHAT_ABOUT_COOKING"].progress = 1;

  const displayCrowns =
    userProjects &&
    userProjects.some((p) => {
      return (
        lastSample.projects[p.name] &&
        lastSample.projects[p.name].progress === 1
      );
    });

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
              {new Date(maxDate).toLocaleDateString("en-US")}{" "}
              <span
                style={{
                  color:
                    daysFromDeadline > 0
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                }}
              >
                ({daysFromDeadline}d {daysFromDeadline >= 0 ? "left" : "late"})
              </span>
            </span>
          </p>

          {/* Total frames */}
          {data && data.length !== 0 && (
            <p>
              Total progress :
              <span
                style={{
                  backgroundColor:
                    daysFromDeadline > 0
                      ? COLORS.silexGreen
                      : theme.palette.error.main,
                  color: "white",
                  borderRadius: 10,
                  marginLeft: 10,
                  padding: 8,
                }}
              >
                {totalProgressFrames} / {totalFrames} (
                {Math.floor((totalProgressFrames / totalFrames) * 100)}%)
              </span>
            </p>
          )}
        </div>
      </div>

      {!(
        window.localStorage.getItem(
          "settings-disable-stats-crown-animation"
        ) === "true"
      ) &&
        displayCrowns && <CrownAnimation />}

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
                selectedProjects.length > 0
                  ? selectedProjects.includes(p.name)
                  : true
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
                  stroke={project.color || getColorFromString(project.name)}
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

                return `${frames} / ${totalFramesProject} frames (${Math.floor(
                  p * 100
                )}%)`;
              }}
              labelFormatter={(d) => new Date(d).toLocaleDateString("en-US")}
            />

            {/* Deadline vertical line */}
            <ReferenceLine
              x={maxDate}
              stroke="rgba(255, 0, 0)"
              strokeDasharray="3 3"
            />

            {/* Average projection line to latest point */}
            <ReferenceLine
              stroke="red"
              strokeDasharray="8 10"
              ifOverflow="hidden"
              segment={[
                { x: START_DATE, y: averageProjection(START_DATE) },
                {
                  x: data[data.length - 1].date,
                  y: data[data.length - 1].projects[AVG_KEY].progress,
                },
              ]}
            />

            {/* Average projection line to the max date */}
            {data[data.length - 1].date < maxDate && (
              <ReferenceLine
                label="Projection"
                stroke="red"
                strokeDasharray="8 10"
                ifOverflow="hidden"
                segment={[
                  {
                    x: data[data.length - 1].date,
                    y: data[data.length - 1].projects[AVG_KEY].progress,
                  },
                  { x: maxDate, y: averageProjection(maxDate) },
                ]}
              />
            )}

            {/* Reference line for each selected project */}
            {selectedProjects.length > 0 &&
              selectedProjects.map((sp) => {
                const projectProjection = linearRegression(data, sp);
                const project = projects.find((p) => p.name === sp) as Project;

                return (
                  <ReferenceLine
                    key={sp}
                    label="Projection"
                    stroke={project.color || getColorFromString(project.name)}
                    strokeDasharray="8 10"
                    ifOverflow="hidden"
                    segment={[
                      { x: START_DATE, y: projectProjection(START_DATE) },
                      {
                        x: data[data.length - 1].date,
                        y: projectProjection(maxDate),
                      },
                    ]}
                  />
                );
              })}

            {/* Linear goal reference line */}
            <ReferenceLine
              label="Goal"
              stroke="red"
              strokeDasharray="3 3"
              ifOverflow="hidden"
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
          const projectColor = p.color || getColorFromString(p.name);
          const selected = selectedProjects.includes(p.name);
          const color = selected ? projectColor : alpha(projectColor, 0.3);

          return (
            <div key={p.name} style={{ position: "relative" }}>
              <Chip
                label={p.name}
                variant="outlined"
                sx={{
                  color,
                  borderColor: color,
                  backgroundColor: selected ? alpha(projectColor, 0.2) : "",
                }}
                onClick={() => {
                  if (selected) {
                    setSelectedProjects(
                      selectedProjects.filter((sp) => sp !== p.name)
                    );
                  } else {
                    setSelectedProjects([...selectedProjects, p.name]);
                  }
                }}
              />
              {lastSample.projects[p.name] &&
                lastSample.projects[p.name].progress === 1 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      transform: "rotate(30deg)",
                    }}
                  >
                    👑
                  </span>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsProgressChart;
