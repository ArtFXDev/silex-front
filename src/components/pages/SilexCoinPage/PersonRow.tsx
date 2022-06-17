/* eslint-disable camelcase */
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import SilexCoinIcon from "assets/images/silex_coin.svg";
import { PersonAvatar } from "components/common/avatar";
import ColoredCircle from "components/common/ColoredCircle/ColoredCircle";
import { useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Person } from "types/entities";
import { GameVariant } from "types/entities/Game";
import { getColorFromString } from "utils/color";

import PersonCollapseSection from "./PersonCollapseSection";

interface PersonRowProps {
  index: number;
  person: Person;
  data: {
    persons: Person[];
    game_variants: GameVariant[];
  };
}

const PersonRow = ({ person, index, data }: PersonRowProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  const coins = person.coins || 0;

  return (
    <div>
      <Paper
        sx={{
          my: 1,
          borderRadius: LIST_ITEM_BORDER_RADIUS,
        }}
      >
        <ListItem disabled={coins === 0}>
          <IconButton
            sx={{ mr: 1.2 }}
            onClick={() => setOpen((o) => !o)}
            style={{
              transition: "all 0.2s ease",
              transform: `rotate(${open ? 90 : 0}deg)`,
            }}
          >
            <ChevronRightIcon color="disabled" fontSize="small" />
          </IconButton>

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
              {index + 1}
            </Typography>
          </ListItemIcon>

          <ListItemIcon style={{ position: "relative" }}>
            <PersonAvatar person={person} size={40} />

            {index <= 2 && (
              <div
                style={{
                  position: "absolute",
                  right: -5,
                  bottom: -5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: (3 - index) * 3 + 8,
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
            {person.game_variants.map((v) => {
              const variant = data.game_variants.find(
                (gv) => gv.id === v.id
              ) as GameVariant;

              return (
                <ColoredCircle
                  key={variant.id}
                  tooltip={{
                    title: `${variant.game.name}: ${variant.title}`,
                  }}
                  border="3px solid #3d3c3c"
                  marginLeft={-5}
                  text={variant.badge || undefined}
                  color={variant.color || getColorFromString(variant.name)}
                  size={35}
                />
              );
            })}
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

      <Collapse unmountOnExit in={open}>
        <PersonCollapseSection person={person} />
      </Collapse>
    </div>
  );
};

export default PersonRow;
