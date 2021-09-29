import { Avatar, AvatarProps } from "@mui/material";

import * as Kitsu from "utils/kitsu";
import { Person } from "types";
import { firstTwoLetters, getPersonColor } from "utils/person";

interface PersonAvatarProps {
  person: Person;
  size: number;
  clickable?: boolean;
}

const PersonAvatar: React.FC<AvatarProps & PersonAvatarProps> = ({
  clickable,
  person,
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
        cursor: clickable ? "pointer" : "default",
        color: "white",
        backgroundColor: personColor,
        transition: "all 0.2s ease",
        width: props.size,
        height: props.size,
        borderColor: personColor,
        borderWidth: 5,
        borderStyle: "solid",
      }}
      {...props}
    >
      {!person.has_avatar && firstTwoLetters(person)}
    </Avatar>
  );
};

export default PersonAvatar;
