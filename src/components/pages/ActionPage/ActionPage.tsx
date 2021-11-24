import FlagIcon from "@mui/icons-material/Flag";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import DCCLogo from "components/common/DCCLogo/DCCLogo";
import { useAction } from "context";
import { useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import PageWrapper from "../PageWrapper/PageWrapper";
import ActionItem from "./ActionItem";

const ActionsView = (): JSX.Element => {
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
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={routeMatch.params.uuid}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(actions).map((uuid) => (
            <Tab
              key={uuid}
              label={actions[uuid].name}
              value={uuid}
              icon={
                actionStatuses[uuid] ? (
                  <FlagIcon />
                ) : (
                  <div style={{ marginLeft: "10px" }}>
                    <DCCLogo
                      name={actions[uuid].context_metadata.dcc}
                      size={20}
                      disabled={!(uuid === routeMatch.params.uuid)}
                    />
                  </div>
                )
              }
              iconPosition="end"
              sx={{
                "&.MuiTab-root": { minHeight: "0px !important" },
              }}
            />
          ))}
        </Tabs>
      </Box>

      <ActionItem uuid={routeMatch.params.uuid} />
    </Box>
  );
};

const ActionPage = (): JSX.Element => {
  const routeMatch = useRouteMatch<{ uuid: string }>();
  const { actions } = useAction();

  const currentAction = routeMatch.params.uuid;

  const firstAction =
    Object.keys(actions).length > 0 &&
    Object.keys(actions)[Object.keys(actions).length - 1];

  return (
    <Switch>
      <Route exact path="/action">
        {firstAction ? (
          <Redirect to={`/action/${firstAction}`} />
        ) : (
          <PageWrapper title={"Actions"} goBack>
            <Typography color="text.disabled">
              You don{"'"}t have any running actions...
            </Typography>
          </PageWrapper>
        )}
      </Route>

      <Route path="/action/:uuid">
        <PageWrapper>
          {actions[currentAction] ? (
            <ActionsView />
          ) : (
            // Redirect to the first action when the url is invalid or to the action page
            <Redirect to={firstAction ? `/action/${firstAction}` : "/action"} />
          )}
        </PageWrapper>
      </Route>
    </Switch>
  );
};

export default ActionPage;
