import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
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

const SearchTextField = (props: TextFieldProps): JSX.Element => {
  return <StyledTextField {...props} />;
};

export default SearchTextField;
