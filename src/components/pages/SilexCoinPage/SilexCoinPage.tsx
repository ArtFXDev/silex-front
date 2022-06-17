/* eslint-disable camelcase */
import { gql, useQuery } from "@apollo/client";
import {
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { IconButton, List } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import SilexLogo from "components/common/SilexLogo/SilexLogo";
import QueryWrapper from "components/utils/QueryWrapper/QueryWrapper";
import { useState } from "react";
import { theme } from "style/theme";
import { Person } from "types/entities";
import { GameVariant } from "types/entities/Game";

import PageWrapper from "../PageWrapper/PageWrapper";
import PersonCard from "./PersonCard";
import PersonRow from "./PersonRow";

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

      game_variants {
        id
      }
    }

    game_variants {
      id
      badge
      title
      color
      price

      game {
        name
      }
    }
  }
`;

const SilexCoinPage = (): JSX.Element => {
  const [gridView, setGridView] = useState<boolean>(
    window.localStorage.getItem("silex-coins-page-list-view") !== "true"
  );

  const query = useQuery<{
    persons: Person[];
    game_variants: GameVariant[];
  }>(PERSONS);

  const mdBreakPoint = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <PageWrapper goBack centerContent>
      <QueryWrapper
        fullWidth
        query={query}
        render={(data) => {
          const filteredPersons = data.persons
            .filter((p) => !p.departments.some((d) => d.name === "TD"))
            .slice()
            .sort((a, b) => (b.coins || 0) - (a.coins || 0));

          const ItemType = gridView ? PersonCard : PersonRow;

          const items = filteredPersons.map((person, i) => (
            <ItemType key={person.id} index={i} data={data} person={person} />
          ));

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div style={{ marginBottom: 30 }}>
                <SilexLogo size={200} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                  gap: 10,
                  marginBottom: gridView ? 25 : 15,
                }}
              >
                <IconButton
                  onClick={() => {
                    setGridView(true);
                    window.localStorage.setItem(
                      "silex-coins-page-list-view",
                      "false"
                    );
                  }}
                  style={{
                    transition: "all 0.2s ease",
                    backgroundColor: gridView
                      ? "rgba(98, 199, 113, 0.3)"
                      : "rgba(98, 199, 113, 0)",
                  }}
                >
                  <GridViewIcon color={gridView ? "action" : "disabled"} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setGridView(false);
                    window.localStorage.setItem(
                      "silex-coins-page-list-view",
                      "true"
                    );
                  }}
                  style={{
                    transition: "all 0.2s ease",
                    backgroundColor: !gridView
                      ? "rgba(98, 199, 113, 0.3)"
                      : "rgba(98, 199, 113, 0)",
                  }}
                >
                  <ListIcon color={gridView ? "disabled" : "action"} />
                </IconButton>
              </div>

              {gridView ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 20,
                    width: mdBreakPoint ? "70%" : "87%",
                  }}
                >
                  {items}
                </div>
              ) : (
                <List sx={{ width: mdBreakPoint ? "50%" : "80%" }}>
                  {items}
                </List>
              )}
            </div>
          );
        }}
      />
    </PageWrapper>
  );
};

export default SilexCoinPage;
