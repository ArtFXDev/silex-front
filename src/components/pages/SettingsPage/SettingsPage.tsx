import { Paper, Switch, Typography } from "@mui/material";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";

import PageWrapper from "../PageWrapper/PageWrapper";

const settings = [
  { key: "silex-coins-animation", text: "Silex coins animation" },
  {
    key: "disable-stats-crown-animation",
    text: "Disable crown animation in stats page",
  },
];

const SettingsPage = (): JSX.Element => {
  return (
    <PageWrapper title="Settings" goBack>
      {settings.map((setting) => {
        const settingsKey = `settings-${setting.key}`;
        const defaultChecked =
          window.localStorage.getItem(settingsKey) === "true";

        return (
          <Paper
            key={setting.key}
            sx={{
              px: 3,
              py: 1,
              my: 1,
              borderRadius: LIST_ITEM_BORDER_RADIUS,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography style={{ display: "inline-block" }}>
              {setting.text}
            </Typography>
            <Switch
              defaultChecked={defaultChecked}
              color="success"
              onChange={() => {
                const current =
                  window.localStorage.getItem(settingsKey) === "true";
                window.localStorage.setItem(settingsKey, (!current).toString());
              }}
            />
          </Paper>
        );
      })}
    </PageWrapper>
  );
};

export default SettingsPage;
