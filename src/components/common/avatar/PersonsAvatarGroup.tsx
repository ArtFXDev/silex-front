import { AvatarGroup, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { Person } from "~/types/entities";

import PersonAvatar from "./PersonAvatar";

interface PersonsAvatarGroupProps {
  /** The array of persons to display */
  persons: Person[];

  /** The size passed to each avatar */
  size?: number;

  /** The font size passed to each avatar */
  fontSize?: number;

  /** Displayed when there are no persons */
  fallbackMessage?: string;

  /** sx props passed to AvatarGroup */
  sx?: SxProps<Theme>;
}

/**
 * Group of avatars using the PersonAvatar component
 */
const PersonsAvatarGroup = ({
  persons,
  fontSize,
  size,
  fallbackMessage,
  sx,
}: PersonsAvatarGroupProps): JSX.Element => (
  <>
    {persons.length !== 0 ? (
      <AvatarGroup max={4} sx={sx}>
        {persons.map((person) => (
          <PersonAvatar
            person={person}
            key={person.id}
            size={size || 25}
            fontSize={fontSize || 15}
            tooltip
          />
        ))}
      </AvatarGroup>
    ) : fallbackMessage ? (
      <Typography variant="subtitle1" color="text.disabled" sx={sx}>
        {fallbackMessage}
      </Typography>
    ) : null}
  </>
);

export default PersonsAvatarGroup;
