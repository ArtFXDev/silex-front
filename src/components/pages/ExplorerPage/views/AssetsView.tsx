import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useRouteMatch } from "react-router";
import { Project } from "types/entities";

import EntitiesView from "./EntitiesView";

const ASSETS = gql`
  query GetAssets($id: ID!) {
    project(id: $id) {
      assets {
        id
        name
        type
        preview_file_id
      }
    }
  }
`;

const AssetsView = ({ listView }: { listView: boolean }): JSX.Element => {
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data && data.project.assets.length > 0 ? (
        <EntitiesView entities={data.project.assets} listView={listView} />
      ) : (
        <Typography color="text.disabled">
          The project doesn{"'"}t contain any assets...
        </Typography>
      )}
    </QueryWrapper>
  );
};

export default AssetsView;
