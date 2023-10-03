import { List } from "@mui/material";

import { Asset, Shot, Task } from "~/types/entities";

import EntityItem from "./EntityItem/EntityItem";

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
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 }}
        >
          {entitiesItems}
        </div>
      )}
    </>
  );
};

export default EntitiesView;
