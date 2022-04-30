import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import SilexCoinIcon from "assets/images/silex_coin.svg";
import { PersonAvatar } from "components/common/avatar";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import SilexLogo from "components/common/SilexLogo/SilexLogo";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Person } from "types/entities";
import { getColorFromString } from "utils/color";

import PageWrapper from "../PageWrapper/PageWrapper";

const PERSONS = gql`
  query Persons {
    persons {
      id

      full_name
      first_name
      last_name

      coins

      has_avatar
      data

      departments {
        id
        name
      }

      projects {
        id
        name
      }
    }
  }
`;

const SilexCoinPage = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<{
    persons: Person[];
  }>(PERSONS);

  return (
    <PageWrapper goBack>
      {loading ? (
        <CircularProgress />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: 30 }}>
            <SilexLogo size={200} />
          </div>

          <List sx={{ width: "50%" }}>
            {data?.persons
              .filter((p) => !p.departments.some((d) => d.name === "TD"))
              .slice()
              .sort((a, b) => (b.coins || 0) - (a.coins || 0))
              .map((person, i) => {
                const coins = person.coins || 0;
                return (
                  <Paper
                    key={person.id}
                    sx={{
                      my: 1,
                      borderRadius: LIST_ITEM_BORDER_RADIUS,
                    }}
                  >
                    <ListItem disabled={coins === 0}>
                      <ListItemIcon style={{ position: "relative" }}>
                        <Typography
                          color="text.disabled"
                          sx={{
                            px: 1.2,
                            py: 0.4,
                            fontSize: 14,
                            borderRadius: 9999,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          {i + 1}
                        </Typography>
                      </ListItemIcon>

                      <ListItemIcon style={{ position: "relative" }}>
                        <PersonAvatar person={person} size={40} />

                        {i <= 2 && (
                          <div
                            style={{
                              position: "absolute",
                              right: -5,
                              bottom: -5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: (3 - i) * 3 + 8,
                              width: 40,
                              marginRight: 10,
                            }}
                          >
                            🏆
                          </div>
                        )}
                      </ListItemIcon>

                      <ListItemText>
                        {person.first_name} {person.last_name}
                      </ListItemText>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row-reverse",
                        }}
                      >
                        {person.projects.map((p) => (
                          <ColoredCircle
                            border="3px solid #3d3c3c"
                            marginLeft={-5}
                            key={p.name}
                            color={getColorFromString(p.name)}
                            size={25}
                          />
                        ))}
                      </div>

                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "9999px",
                          ml: 2,
                          pl: 1.4,
                          pr: 1.2,
                          py: 0.5,
                        }}
                      >
                        {coins}
                        <img
                          width={20}
                          height={20}
                          src={SilexCoinIcon}
                          style={{
                            marginLeft: 5,
                            filter: `grayscale(${coins === 0 ? "1" : "0"})`,
                          }}
                        />
                      </Paper>
                    </ListItem>
                  </Paper>
                );
              })}
          </List>
        </div>
      )}
    </PageWrapper>
  );
};

export default SilexCoinPage;
