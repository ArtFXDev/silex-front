import FlagIcon from "@mui/icons-material/Flag";
import { Box, FormControlLabel, Switch, Tab, Tabs } from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAction } from "context";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getLastStepStatusColor } from "utils/action";

import ActionItem from "./ActionItem";

const ActionsView = (): JSX.Element => {
  const [simpleMode, setSimpleMode] = useState<boolean>(
    window.localStorage.getItem("action-simple-mode") === "true"
  );

  const routeMatch = useRouteMatch<{ uuid: string }>();
  const history = useHistory();
  const { actions, actionStatuses, clearAction, cleanActions } = useAction();

  useEffect(() => {
    // Listen to react router route change
    const unlisten = history.listen((location) => {
      if (!location.pathname.startsWith("/action")) {
        cleanActions();
      }
    });

    // Clear the listener
    return unlisten;
  }, [actionStatuses, cleanActions, clearAction, history]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    history.push(`/action/${newValue}`);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box
        sx={{ display: "flex", borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tabs
          value={routeMatch.params.uuid}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(actions).map((uuid) => {
            const actionColor = getLastStepStatusColor(actions[uuid]);

            return (
              <Tab
                key={uuid}
                label={actions[uuid].name}
                value={uuid}
                icon={
                  actionStatuses[uuid] ? (
                    <FlagIcon sx={{ color: actionColor }} />
                  ) : (
                    <div style={{ marginLeft: "10px" }}>
                      <DCCLogo
                        action
                        name={actions[uuid].context_metadata.dcc}
                        size={20}
                        disabled={!(uuid === routeMatch.params.uuid)}
                      />
                    </div>
                  )
                }
                iconPosition="end"
                sx={{
                  "&.MuiTab-root": {
                    minHeight: "0px !important",
                    color:
                      uuid === routeMatch.params.uuid
                        ? actionColor
                        : "text.disabled",
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
      </Box>

      <ActionItem uuid={routeMatch.params.uuid} simplify={simpleMode} />
    </Box>
  );
};

export default ActionsView;
