import { List } from "@mui/material";
import { Action } from "types/action/action";

import StepItem from "./StepItem";

interface ActionItemProps {
  root?: boolean;
  action: Action;
  depth: number;
}

export const ActionItem = ({
  action,
  root,
  depth,
}: ActionItemProps): JSX.Element => {
  return (
    <List
      sx={{
        mb: 2,
        backgroundColor: `rgba(128, 128, 128, ${depth * 0.1})`,
        borderRadius: 3,
        p: !root ? 2 : 0,
      }}
    >
      {Object.values(action.children)
        .filter((s) => !s.hide)
        .sort((a, b) => a.index - b.index)
        .map((child) =>
          child.buffer_type === "steps" ? (
            <StepItem key={child.uuid} step={child} />
          ) : (
            <ActionItem action={child} depth={depth + 1} />
          )
        )}
    </List>
  );
};

export default ActionItem;
