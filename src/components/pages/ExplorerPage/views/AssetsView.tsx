import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Typography } from "@mui/material";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Asset, EntityType, Project } from "types/entities";
import { fuzzyMatch } from "utils/string";

import CreateAssetModal from "./CreateAssetModal/CreateAssetModal";
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
          id
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
  const [choosenAssetCategory, setChoosenAssetCategory] = useState<string>();
  const [createAssetModal, setCreateAssetModal] = useState<boolean>(false);

  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  // Process assets to put organize them by categories
  const assetByTypes: { [assetType: EntityType["id"]]: Asset[] } = {};
  const assetTypes: { [id: EntityType["id"]]: EntityType["name"] } = {};
  if (data) {
    for (const asset of data.project.assets) {
      if (!assetByTypes[asset.entity_type.id]) {
        assetByTypes[asset.entity_type.id] = [];
      }
      assetByTypes[asset.entity_type.id].push(asset);
      assetTypes[asset.entity_type.id] = asset.entity_type.name;
    }
  }

  return (
    <>
      <QueryWrapper query={query}>
        {data && data.project.assets.length > 0 ? (
          Object.keys(assetByTypes).map((categoryId, i) => {
            const filteredAssets = assetByTypes[categoryId]
              .filter((asset) => fuzzyMatch(asset.name, search))
              .sort((a, b) => a.name.localeCompare(b.name));

            const isLast = i === data.project.assets.length - 1;

            return (
              filteredAssets.length !== 0 && (
                <div key={categoryId}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h2
                      style={{
                        marginBottom: 0,
                        marginTop: 0,
                      }}
                    >
                      {assetTypes[categoryId]}
                    </h2>

                    <IconButton
                      sx={{ ml: 2 }}
                      onClick={() => {
                        setChoosenAssetCategory(categoryId);
                        setCreateAssetModal(true);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>

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

      {createAssetModal && (
        <CreateAssetModal
          defaultValue={choosenAssetCategory as string}
          onClose={() => setCreateAssetModal(false)}
        />
      )}
    </>
  );
};

export default AssetsView;
