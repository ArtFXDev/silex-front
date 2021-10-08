import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const CategorySelector = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string>("shots");

  const location = useLocation();
  const history = useHistory();

  const handleChange = (event: SelectChangeEvent<string>) => {
    history.push(
      `${location.pathname.split(selectedCategory)[0]}${event.target.value}`
    );
    setSelectedCategory(event.target.value);
  };

  return (
    <Select
      sx={{
        width: 230,
        height: 50,
        borderRadius: 3,
        paddingTop: 0,
        fontSize: 20,
      }}
      variant="outlined"
      value={selectedCategory}
      onChange={handleChange}
    >
      <MenuItem value="shots">Shots</MenuItem>
      <MenuItem value="assets">Assets</MenuItem>
    </Select>
  );
};

export default CategorySelector;
