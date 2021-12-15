import SendIcon from "@mui/icons-material/Send";
import { uiSocket } from "context";

import LoadingChip from "./LoadingChip";

const color = "#9575cd";

const SubmitButton = (): JSX.Element => (
  <LoadingChip
    label="Submit"
    color={color}
    icon={<SendIcon sx={{ color }} />}
    onClick={(done) => {
      uiSocket.emit("launchAction", { action: "submit" }, () => done());
    }}
  />
);

export default SubmitButton;
