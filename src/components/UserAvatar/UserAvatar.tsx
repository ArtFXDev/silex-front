import { Avatar, AvatarProps } from "@mui/material";

import { useAuth } from "context/AuthContext";
import * as Kitsu from "utils/kitsu";

type UserAvatarProps = AvatarProps & { size: number; clickable?: boolean };

const UserAvatar: React.FC<UserAvatarProps> = ({ clickable, ...props }) => {
  const user = useAuth().user!;

  const userColor = user.getHexColor();

  return (
    <Avatar
      alt={user.fullName()}
      src={user.has_avatar ? Kitsu.pictureThumbnailURL("persons", user.id) : ""}
      sx={{
        cursor: clickable ? "pointer" : "default",
        color: "white",
        backgroundColor: userColor,
        transition: "all 0.2s ease",
        width: props.size,
        height: props.size,
        borderColor: userColor,
        borderWidth: 5,
        borderStyle: "solid",
      }}
      {...props}
    >
      {!user.has_avatar && user.firstTwoLetters()}
    </Avatar>
  );
};

export default UserAvatar;
