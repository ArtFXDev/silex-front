import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";

import DCCClientsPage from "~/components/pages/DCCClientsPage/DCCClientsPage";
// import ActionsPage from "~/components/pages/ActionPage/ActionsPage";
import ExplorerPage from "~/components/pages/ExplorerPage/ExplorerPage";
import HarvestPage from "~/components/pages/HarvestPage/HarvestPage";
import HomePage from "~/components/pages/HomePage/HomePage";
import LoginPage from "~/components/pages/LoginPage/LoginPage";
import LogsPage from "~/components/pages/LogsPage/LogsPage";
import NotFoundPage from "~/components/pages/NotFoundPage/NotFoundPage";
import ProfilePage from "~/components/pages/ProfilePage/ProfilePage";
import RenderFarmPage from "~/components/pages/RenderFarmPage/RenderFarmPage";
import SettingsPage from "~/components/pages/SettingsPage/SettingsPage";
import SilexCoinPage from "~/components/pages/SilexCoinPage/SilexCoinPage";
import StatsPage from "~/components/pages/StatsPage/StatsPage";
import TicketPage from "~/components/pages/TicketPage/TicketPage";
// import NotFoundPage from "~/components/pages/NotFoundPage/NotFoundPage";
import Header from "~/components/structure/Header/Header";
import PrivateRoutes from "~/components/utils/PrivateRoutes";
// import RunningJobsPage from "~/components/pages/RunningJobsPage/RunningJobsPage";
// import SettingsPage from "~/components/pages/SettingsPage/SettingsPage";
import {
  ProvideAction,
  ProvideAuth,
  ProvideGraphQLClient,
  ProvideSocket,
} from "~/context";
import { ProvideAnimation } from "~/context/AnimationContext";
import { ProvideBlade } from "~/context/BladeContext";
import AppGlobalStyles from "~/style/AppGlobalStyles";
import { theme } from "~/style/theme";

const Providers = () => (
  <SnackbarProvider maxSnack={3}>
    <ProvideAnimation>
      <ProvideGraphQLClient>
        <ProvideAuth>
          <ProvideSocket>
            <ProvideAction>
              <ProvideBlade>
                <Outlet />
              </ProvideBlade>
            </ProvideAction>
          </ProvideSocket>
        </ProvideAuth>
      </ProvideGraphQLClient>
    </ProvideAnimation>
  </SnackbarProvider>
);

const WithHeader = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoutes />}>
        <Route element={<WithHeader />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explorer/*" element={<ExplorerPage />} />

          {/* Header */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/coins" element={<SilexCoinPage />} />
          <Route path="/dccs" element={<DCCClientsPage />} />

          <Route path="/stats" element={<StatsPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/render-farm" element={<RenderFarmPage />} />
          <Route path="/harvest" element={<HarvestPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logs" element={<LogsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Route>
  )
);

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/">
//       <Route path="/login">
//         <LoginPage />
//       </Route>
//
//       <PrivateRoute path="/logs" allowNonAuth>
//         <LogsPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/action/:uuid?" allowNonAuth>
//         <ActionsPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/running-jobs" allowNonAuth>
//         <RunningJobsPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/stats" allowNonAuth>
//         <StatsPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/">
//         <HomePage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/profile">
//         <ProfilePage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/coins">
//         <SilexCoinPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/dccs">
//         <DCCClientsPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/explorer/*">
//         <ExplorerPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/tractor">
//         <TractorPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/harvest">
//         <HarvestPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/ticket">
//         <TicketPage />
//       </PrivateRoute>
//
//       <PrivateRoute path="/settings">
//         <SettingsPage />
//       </PrivateRoute>
//
//       {/* 404 fallback page */}
//       <Route path="/*">
//         <NotFoundPage />
//       </Route>
//     </Route>
//   )
// );

const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    {/* Does a CSS normalize */}
    <CssBaseline />
    <AppGlobalStyles />

    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
