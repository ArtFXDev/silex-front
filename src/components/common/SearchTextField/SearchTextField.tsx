import ClearIcon from "@mui/icons-material/Clear";
import { Box, IconButton, TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#62c673",
  },
  "& .MuiOutlinedInput-root": {
    color: "#9F9E9E",
    borderRadius: 10,
    "& fieldset": {
      borderColor: "#5d5c5c",
    },
    "&:hover fieldset": {
      borderColor: "#605E5E",
    },
    "&.Mui-focused fieldset": {
      transition: "all 0.1s ease",
      borderColor: "#62c673",
    },
  },
});

interface SearchTextFieldProps {
  onClear: () => void;
}

const SearchTextField = (
  props: SearchTextFieldProps & TextFieldProps
): JSX.Element => {
  const { sx, onClear, ...rest } = props;

  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <StyledTextField {...rest} />
      <IconButton
        style={{ display: "absolute", right: 45, marginLeft: 5, padding: 5 }}
        onClick={onClear}
      >
        <ClearIcon color="disabled" fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SearchTextField;
