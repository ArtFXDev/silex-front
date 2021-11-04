import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const categories = [
  { value: "shots", label: "Shots" },
  { value: "assets", label: "Assets" },
];

const CategorySelector = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const tokens = location.pathname.split("/");
    if (tokens.length >= 3) {
      setSelectedCategory(tokens[3]);
    }
  }, [location.pathname]);

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
      {categories.map((category) => (
        <MenuItem key={category.value} value={category.value}>
          {category.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CategorySelector;
