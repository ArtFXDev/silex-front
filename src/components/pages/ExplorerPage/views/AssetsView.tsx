import { gql, useQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

import CreateEntityModal from "~/components/common/CreateEntityModal/CreateEntityModal";
import QueryWrapper from "~/components/utils/QueryWrapper/QueryWrapper";
import { Asset, EntityType, Project } from "~/types/entities";
import { fuzzyMatch } from "~/utils/string";

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

  const routeParams = useParams<{ projectId: string }>();

  const query = useQuery<{ project: Project }>(ASSETS, {
    variables: { id: routeParams.projectId },
  });

  const openCreateAssetModalWithType = (assetTypeId: string) => {
    setChoosenAssetCategory(assetTypeId);
  };

  return (
    <QueryWrapper
      query={query}
      render={(data) => {
        // Organize assets by categories
        const assetByTypes: { [assetType: EntityType["id"]]: Asset[] } = {};
        const assetTypes: { [id: EntityType["id"]]: EntityType["name"] } = {};
        let emptySearchResults = true;

        for (const asset of data.project.assets) {
          if (!assetByTypes[asset.entity_type.id]) {
            assetByTypes[asset.entity_type.id] = [];
          }

          // Filter with the search input
          if (fuzzyMatch([asset.entity_type.name, asset.name], search)) {
            assetByTypes[asset.entity_type.id].push(asset);
            emptySearchResults = false;
          }

          // Store the category name
          assetTypes[asset.entity_type.id] = asset.entity_type.name;
        }

        let displaySentence = null;

        if (emptySearchResults) {
          displaySentence = (
            <Typography color="text.disabled">No results found...</Typography>
          );
        }

        if (data.project.assets.length === 0) {
          displaySentence = (
            <Typography color="text.disabled">
              The project doesn{"'"}t contain any assets...
            </Typography>
          );
        }

        return (
          <>
            {Object.keys(assetByTypes).map((assetTypeId, i) => {
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

                    <EntitiesView
                      entities={filteredAssets}
                      listView={listView}
                    />

                    {!isLast && <br />}
                  </div>
                )
              );
            })}

            {displaySentence}

            <Button
              variant="outlined"
              color="secondary"
              sx={{ textTransform: "none", mt: 3 }}
              startIcon={<AddIcon />}
              onClick={() => setChoosenAssetCategory("")}
            >
              New asset...
            </Button>

            {choosenAssetCategory !== undefined && (
              <CreateEntityModal
                onClose={() => setChoosenAssetCategory(undefined)}
                entityType="Asset"
                defaultCategory={choosenAssetCategory}
              />
            )}
          </>
        );
      }}
    />
  );
};

export default AssetsView;
