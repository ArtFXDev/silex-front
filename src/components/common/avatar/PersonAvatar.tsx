import { Avatar, AvatarProps, Tooltip } from "@mui/material";

import { Person } from "~/types/entities";
import { firstTwoLetters, getPersonColor } from "~/utils/person";
import * as Zou from "~/utils/zou";

interface PersonAvatarProps {
  /** The person to display */
  person: Person;

  /** The size (width and height) of the avatar */
  size: number;

  /** The font size in case there is no thumbnail */
  fontSize?: number;

  /** Wether or not put a pointer cursor */
  clickable?: boolean;

  /** Display a tooltip on mouse hover */
  tooltip?: boolean;
}

/**
 * Avatar wrapper component with optional tooltip
 */
const PersonAvatar = ({
  clickable,
  person,
  fontSize,
  size,
  tooltip,
  ...props
}: AvatarProps & PersonAvatarProps): JSX.Element => {
  const personColor = getPersonColor(person);

  const avatar = (
    <Avatar
      alt={person.full_name}
      src={
        person.has_avatar ? Zou.pictureThumbnailURL("persons", person.id) : ""
      }
      sx={{
        cursor: clickable ? "pointer" : "inherit",
        color: "white",
        backgroundColor: personColor,
        transition: "all 0.2s ease",
        width: size,
        height: size,
        borderColor: personColor,
        borderWidth: size / 20,
        fontSize: fontSize,
        borderStyle: "solid",
      }}
      {...props}
    >
      {!person.has_avatar && firstTwoLetters(person)}
    </Avatar>
  );

  return tooltip ? (
    <Tooltip title={person.full_name} arrow>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );
};

export default PersonAvatar;
