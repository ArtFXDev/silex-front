import SendIcon from "@mui/icons-material/Send";
import { uiSocket } from "context";
import { COLORS } from "style/colors";

import LoadingChip from "./LoadingChip";

interface SubmitButtonProps {
  disabled?: boolean;
}

const SubmitButton = ({ disabled }: SubmitButtonProps): JSX.Element => (
  <LoadingChip
    disabled={disabled}
    label="Submit"
    color={COLORS.submit}
    icon={
      <SendIcon sx={{ color: disabled ? "text.disabled" : COLORS.submit }} />
    }
    clickNotification={{ message: "Launched submit", variant: "success" }}
    onClick={(done) => {
      uiSocket.emit("launchAction", { action: "submit" }, () => done());
    }}
  />
);

export default SubmitButton;
