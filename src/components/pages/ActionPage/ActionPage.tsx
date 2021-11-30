import { Typography } from "@mui/material";
import { useAction } from "context";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";

import PageWrapper from "../PageWrapper/PageWrapper";
import ActionsView from "./ActionsView";

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
