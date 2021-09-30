import { gql, useQuery } from "@apollo/client";

import { Project } from "types";
import QueryWrapper from "components/QueryWrapper/QueryWrapper";
import EntitiesView from "./EntitiesView";
import { useRouteMatch } from "react-router";

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

const AssetsView: React.FC<{ listView: boolean }> = ({ listView }) => {
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  return (
    <QueryWrapper query={query}>
      {data && (
        <EntitiesView entities={data.project.assets} listView={listView} />
      )}
    </QueryWrapper>
  );
};

export default AssetsView;
