import SendIcon from "@mui/icons-material/Send";
import { Chip } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { launchAction } from "utils/action";

const RenderController = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = () => {
    setLoading(true);

    launchAction(
      {
        action: "submit",
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_response) => {
        setLoading(false);
      }
    );
  };

  return (
    <Chip
      label="Submit"
      variant="outlined"
      color="info"
      onClick={onClick}
      onDelete={onClick}
      deleteIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
    />
  );
};

export default RenderController;
