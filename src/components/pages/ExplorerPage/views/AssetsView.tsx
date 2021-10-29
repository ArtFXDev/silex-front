import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useRouteMatch } from "react-router";
import { Asset, EntityType, Project } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";

const ASSETS = gql`
  query GetAssets($id: ID!) {
    project(id: $id) {
      assets {
        id
        name
        type
        preview_file_id

        entity_type {
          name
        }
      }
    }
  }
`;

interface AssetsViewProps {
  listView: boolean;
  search: string;
}

const AssetsView = ({ listView, search }: AssetsViewProps): JSX.Element => {
  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  // Process assets to put organize them by categories
  const assetByTypes: { [assetType: EntityType["name"]]: Asset[] } = {};
  if (data) {
    for (const asset of data.project.assets) {
      if (!assetByTypes[asset.entity_type.name]) {
        assetByTypes[asset.entity_type.name] = [];
      }
      assetByTypes[asset.entity_type.name].push(asset);
    }
  }

  return (
    <QueryWrapper query={query}>
      {data && data.project.assets.length > 0 ? (
        Object.keys(assetByTypes).map((category, i) => {
          const filteredAssets = assetByTypes[category]
            .filter((asset) => fuzzyMatch(asset.name, search))
            .sort((a, b) => a.name.localeCompare(b.name));

          const isLast = i === data.project.assets.length - 1;

          return (
            filteredAssets.length !== 0 && (
              <div key={category}>
                <h2 style={{ marginBottom: 0, marginTop: 0 }}>{category}</h2>

                <EntitiesView entities={filteredAssets} listView={listView} />

                {!isLast && <br />}
              </div>
            )
          );
        })
      ) : (
        <Typography color="text.disabled">
          The project doesn{"'"}t contain any assets...
        </Typography>
      )}
    </QueryWrapper>
  );

  // return (
  //   <QueryWrapper query={query}>
  //     {data && data.project.assets.length > 0 ? (

  //         <EntitiesView
  //           entities={data.project.assets}
  //           listView={listView}
  //           search={search}
  //         />
  //       )
  //     ) : (
  //       <Typography color="text.disabled">
  //         The project doesn{"'"}t contain any assets...
  //       </Typography>
  //     )}
  //   </QueryWrapper>
  // );
};

export default AssetsView;
