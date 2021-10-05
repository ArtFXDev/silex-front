import { Box, List } from "@mui/material";

import EntityItem from "./EntityItem";
import { Asset, Shot, Task } from "types";

interface EntitiesViewProps {
  entities: (Shot | Task | Asset)[];
  listView: boolean;
  openTaskModal?: (taskId: string) => void;
}

const EntitiesView: React.FC<EntitiesViewProps> = ({
  entities,
  listView,
  openTaskModal,
}) => {
  const entitiesItems = (
    <>
      {entities.map((e, i) => (
        <EntityItem
          index={i}
          entity={e}
          key={e.id}
          listView={listView}
          openTaskModal={openTaskModal}
        />
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
