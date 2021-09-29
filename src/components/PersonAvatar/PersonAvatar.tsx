import { Avatar, AvatarProps } from "@mui/material";

import * as Kitsu from "utils/kitsu";
import { Person } from "types";
import { firstTwoLetters, getPersonColor } from "utils/person";

interface PersonAvatarProps {
  /** The person to display */
  person: Person;
  /** The size (width and height) of the avatar */
  size: number;
  /** The font size in case there is no thumbnail */
  fontSize?: number;
  /** Wether or not put a pointer cursor */
  clickable?: boolean;
}

const PersonAvatar: React.FC<AvatarProps & PersonAvatarProps> = ({
  clickable,
  person,
  fontSize,
  size,
  ...props
}) => {
  const personColor = getPersonColor(person);

  return (
    <Avatar
      alt={person.full_name}
      src={
        person.has_avatar ? Kitsu.pictureThumbnailURL("persons", person.id) : ""
      }
      sx={{
        cursor: clickable ? "pointer" : "inherit",
        color: "white",
        backgroundColor: personColor,
        transition: "all 0.2s ease",
        width: size,
        height: size,
        borderColor: personColor,
        borderWidth: 5,
        fontSize: fontSize,
        borderStyle: "solid",
      }}
      {...props}
    >
      {!person.has_avatar && firstTwoLetters(person)}
    </Avatar>
  );
};

export default PersonAvatar;
