import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import SilexCoinIcon from "assets/images/silex_coin.svg";
import { PersonAvatar } from "components/common/avatar";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Person, UserData } from "types/entities";

import PageWrapper from "../PageWrapper/PageWrapper";

const PERSONS = gql`
  query Persons {
    persons {
      id

      full_name
      first_name
      last_name

      has_avatar
      data
    }
  }
`;

function getPersonCoins(person: Person): number {
  const userData = JSON.parse(person.data as string) as UserData;
  let coins = 0;
  if (userData && userData.silexCoins) coins = userData.silexCoins;
  return coins;
}

const SilexCoinPage = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, error, data } = useQuery<{
    persons: Person[];
  }>(PERSONS);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <PageWrapper goBack>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <List sx={{ width: "50%" }}>
          {data?.persons
            .slice()
            .sort((a, b) => getPersonCoins(b) - getPersonCoins(a))
            .map((person, i) => {
              return (
                <Fade key={person.id} in>
                  <Paper sx={{ my: 1, borderRadius: LIST_ITEM_BORDER_RADIUS }}>
                    <ListItem>
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

                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "9999px",
                          pl: 1.4,
                          pr: 1.2,
                          py: 0.5,
                        }}
                      >
                        {getPersonCoins(person)}
                        <img
                          width={20}
                          height={20}
                          src={SilexCoinIcon}
                          style={{ marginLeft: 5 }}
                        />
                      </Paper>
                    </ListItem>
                  </Paper>
                </Fade>
              );
            })}
        </List>
      </div>
    </PageWrapper>
  );
};

export default SilexCoinPage;
