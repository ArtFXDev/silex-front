import { Navigate, Route, Routes, useMatch } from "react-router-dom";

import PageWrapper from "~/components/pages/PageWrapper/PageWrapper";
import { useAction } from "~/context";

import ActionsView from "./ActionsView";

/**
 * The action page is responsible for routing to the correct action tab
 */
const ActionsPage = (): JSX.Element => {
  const { actions } = useAction();

  const routeMatch = useMatch("/action/:uuid");
  const currentActionId = routeMatch?.params.uuid as string;

  const firstAction =
    Object.keys(actions).length > 0 &&
    Object.keys(actions)[Object.keys(actions).length - 1];

  return (
    <Routes>
      <Route
        path=""
        element={
          firstAction ? (
            <Navigate to={`/action/${firstAction}`} />
          ) : (
            // Redirect to the previous page if there's no actions
            <Navigate to="/" />
          )
        }
      />

      <Route
        path=":uuid"
        element={
          <PageWrapper>
            {actions[currentActionId] ? (
              <ActionsView />
            ) : (
              // Redirect to the first action when the url is invalid or to the action page
              <Navigate to={firstAction ? `${firstAction}` : "/"} />
            )}
          </PageWrapper>
        }
      />
    </Routes>
  );
};

export default ActionsPage;
