import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import CreateEntityModal from "components/common/CreateEntityModal/CreateEntityModal";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { Asset, EntityType, Project } from "types/entities";
import { fuzzyMatch } from "utils/string";

import EntitiesView from "./EntitiesView";

const ASSETS = gql`
  query Assets($id: ID!) {
    project(id: $id) {
      id

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

  const routeMatch = useRouteMatch<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeMatch.params.projectId },
  });
  const { data } = query;

  // Organize assets by categories
  const assetByTypes: { [assetType: EntityType["id"]]: Asset[] } = {};
  const assetTypes: { [id: EntityType["id"]]: EntityType["name"] } = {};

  let emptySearchResults = true;

  if (data) {
    for (const asset of data.project.assets) {
      if (!assetByTypes[asset.entity_type.id]) {
        assetByTypes[asset.entity_type.id] = [];
      }

      // Filter with the search input
      if (fuzzyMatch(asset.name, search)) {
        assetByTypes[asset.entity_type.id].push(asset);
        emptySearchResults = false;
      }

      // Store the category name
      assetTypes[asset.entity_type.id] = asset.entity_type.name;
    }
  }

  const openCreateAssetModalWithType = (assetTypeId: string) => {
    setChoosenAssetCategory(assetTypeId);
  };

  return (
    <>
      <QueryWrapper query={query}>
        {data && data.project.assets.length > 0 && !emptySearchResults ? (
          Object.keys(assetByTypes).map((assetTypeId, i) => {
            const filteredAssets = assetByTypes[assetTypeId].sort((a, b) =>
              a.name.localeCompare(b.name)
            );

            const isLast = i === data.project.assets.length - 1;

            return (
              filteredAssets.length !== 0 && (
                <div key={assetTypeId}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h2
                      style={{
                        marginBottom: 0,
                        marginTop: 0,
                      }}
                    >
                      {assetTypes[assetTypeId]}
                    </h2>

                    {/* Add a new asset + button */}
                    <Tooltip title="New asset" placement="top" arrow>
                      <IconButton
                        sx={{ ml: 1.5 }}
                        onClick={() =>
                          openCreateAssetModalWithType(assetTypeId)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <EntitiesView entities={filteredAssets} listView={listView} />

                  {!isLast && <br />}
                </div>
              )
            );
          })
        ) : emptySearchResults ? (
          <Typography color="text.disabled">No results found...</Typography>
        ) : (
          <Typography color="text.disabled">
            The project doesn{"'"}t contain any assets...
          </Typography>
        )}

        <Button
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none", mt: 3 }}
          startIcon={<AddIcon />}
          onClick={() => setChoosenAssetCategory("")}
        >
          New asset...
        </Button>
      </QueryWrapper>

      {choosenAssetCategory !== undefined && (
        <CreateEntityModal
          onClose={() => setChoosenAssetCategory(undefined)}
          entityType="Asset"
          defaultCategory={choosenAssetCategory}
        />
      )}
    </>
  );
};

export default AssetsView;
