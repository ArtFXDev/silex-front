import FlagIcon from "@mui/icons-material/Flag";
import { FormControlLabel, Switch, Tab, Tabs } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import FileIcon from "~/components/common/FileIcon/FileIcon";
import { useAction } from "~/context";
import { getLastStepStatusColor } from "~/utils/action";

import ActionItem from "./ActionItem";

/**
 * Actions are displayed as tabs so the user can navigate between them
 */
const ActionsView = (): JSX.Element => {
  const currentActionId = useParams<{ uuid: string }>().uuid as string;
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, cleanActions, isActionFinished, simpleMode, setSimpleMode } =
    useAction();

  useEffect(() => {
    if (!location.pathname.startsWith("/action")) {
      cleanActions();
    }
  }, [cleanActions, location]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/action/${newValue}`);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          marginBottom: 27,
        }}
      >
        <Tabs
          value={currentActionId}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(actions).map((uuid) => {
            const { action } = actions[uuid];
            const actionColor = getLastStepStatusColor(action);

            return (
              <Tab
                key={uuid}
                label={action.name}
                value={uuid}
                iconPosition="end"
                icon={
                  isActionFinished(action) ? (
                    <FlagIcon sx={{ color: actionColor }} />
                  ) : (
                    <FileIcon
                      action
                      name={actions[uuid].action.context_metadata.dcc}
                      size={20}
                      disabled={!(uuid === currentActionId)}
                      sx={{ ml: "10px" }}
                    />
                  )
                }
                sx={{
                  "&.MuiTab-root": {
                    minHeight: "0px !important",
                    color:
                      uuid === currentActionId ? actionColor : "text.disabled",
                  },
                }}
              />
            );
          })}
        </Tabs>

        <FormControlLabel
          sx={{ ml: "auto", color: "text.disabled" }}
          control={
            <Switch
              color="info"
              size="small"
              checked={simpleMode}
              onChange={(e) => {
                window.localStorage.setItem(
                  "action-simple-mode",
                  e.target.checked.toString()
                );
                setSimpleMode(e.target.checked);
              }}
            />
          }
          label="Simplify"
        />
      </div>

      <ActionItem uuid={currentActionId} />
    </div>
  );
};

export default ActionsView;
