import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

const CategorySelector: React.FC = () => {
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