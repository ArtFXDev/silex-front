import { Box, List } from "@mui/material";
import { Asset, Shot, Task } from "types/entities";

import EntityItem from "./EntityItem";

interface EntitiesViewProps {
  entities: (Shot | Task | Asset)[];
  listView: boolean;
  openTaskModal?: (taskId: string) => void;
}

const EntitiesView = ({
  entities,
  listView,
}: EntitiesViewProps): JSX.Element => {
  const entitiesItems = (
    <>
      {entities.map((e, i) => (
        <EntityItem index={i} entity={e} key={e.id} listView={listView} />
      ))}
    </>
  );

  return (
    <>
      {listView ? (
        <List>{entitiesItems}</List>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {entitiesItems}
        </Box>
      )}
    </>
  );
};

export default EntitiesView;
