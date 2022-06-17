import { useApolloClient } from "@apollo/client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  Alert,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import SilexCoinIcon from "assets/images/silex_coin.svg";
import { useAuth } from "context";
import { useState } from "react";
import { LIST_ITEM_BORDER_RADIUS } from "style/constants";
import { Person } from "types/entities";
import * as Zou from "utils/zou";

interface PersonCollapseSectionProps {
  person: Person;
}

const PersonCollapseSection = ({
  person,
}: PersonCollapseSectionProps): JSX.Element => {
  const [transferPending, setTransferPending] = useState<
    "loading" | "finished" | "done"
  >("done");
  const [coinsTransferValue, setCoinsTransferValue] = useState<string>("50");
  const [promptPassword, setPromptPassword] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [promptPasswordValue, setPromptPasswordValue] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const auth = useAuth();
  const client = useApolloClient();

  const transferCoins = parseInt(coinsTransferValue);
  const cantTransferCoins =
    transferCoins > (person.coins || 0) || transferCoins < 0;

  const handlePasswordPromptClose = () => {
    if (!auth.user) return;

    setPasswordLoading(true);

    Zou.verifyCredentials({
      email: auth.user.email,
      password: promptPasswordValue,
    }).then((isPasswordCorrect) => {
      if (isPasswordCorrect && auth.user) {
        setTransferPending("loading");
        setPromptPassword(false);
        setPasswordLoading(false);

        Zou.addSilexCoinsTo(auth.user.id, -coinsTransferValue).then(() =>
          Zou.addSilexCoinsTo(person.id, transferCoins)
            .then(auth.updateUser)
            .then(() => client.refetchQueries({ include: "active" }))
            .then(() => {
              setCoinsTransferValue("0");
              setTransferPending("finished");
              setPromptPasswordValue("");
              setPasswordError(false);

              setTimeout(() => setTransferPending("done"), 3000);
            })
        );
      } else {
        setPasswordError(true);
        setPasswordLoading(false);
      }
    });
  };

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          ml: 5,
          px: 2,
          py: 1,
          borderRadius: LIST_ITEM_BORDER_RADIUS,
        }}
      >
        <FormControl sx={{ m: 1 }}>
          <InputLabel
            htmlFor="outlined-adornment-amount"
            color={cantTransferCoins ? "error" : "info"}
          >
            Amount
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={coinsTransferValue}
            sx={{ py: 0 }}
            onChange={(e) => setCoinsTransferValue(e.target.value)}
            label="Amount"
            color="info"
            type="number"
            error={cantTransferCoins}
            startAdornment={
              <InputAdornment position="start">
                <img
                  width={20}
                  height={20}
                  src={SilexCoinIcon}
                  style={{
                    marginLeft: 5,
                  }}
                />
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="outlined"
          style={{ textTransform: "none" }}
          color={transferPending === "finished" ? "success" : "warning"}
          disabled={cantTransferCoins || transferCoins === 0}
          onClick={() => {
            if (
              !auth.user ||
              cantTransferCoins ||
              isNaN(parseInt(coinsTransferValue))
            )
              return;

            setPromptPassword(true);
          }}
        >
          Give {coinsTransferValue} coin{transferCoins > 1 ? "s" : ""} to{" "}
          {person.first_name}
          {transferPending === "loading" ? (
            <CircularProgress
              size={20}
              style={{ marginLeft: 10 }}
              color="warning"
            />
          ) : transferPending === "done" ? (
            <MonetizationOnIcon style={{ marginLeft: 10 }} />
          ) : (
            <CheckCircleIcon color="success" style={{ marginLeft: 10 }} />
          )}
        </Button>
      </Paper>

      <Dialog
        open={promptPassword}
        onClose={() => {
          setPromptPassword(false);
          setPromptPasswordValue("");
          setPasswordError(false);
          setPasswordLoading(false);
        }}
      >
        <DialogTitle>
          Transfer {coinsTransferValue} Silex coin{transferCoins > 1 ? "s" : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Transferring coins to someone else is highly secured to prevent
            fraud. Please type your password to verify your identity:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={promptPasswordValue}
            onChange={(e) => setPromptPasswordValue(e.target.value)}
          />
          <Collapse in={passwordError}>
            <Alert variant="outlined" color="error" sx={{ mt: 3 }}>
              Your password is invalid, try again!
            </Alert>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordPromptClose}>
            Transfer{" "}
            {passwordLoading && <CircularProgress sx={{ ml: 2 }} size={20} />}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PersonCollapseSection;
