import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { NOTIFICATION_TYPES } from "../utils/priorityUtils";

const FilterBar = ({ value, onChange, counts = {} }) => (
  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={2}>
    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
      Filter:
    </Typography>
    {NOTIFICATION_TYPES.map((type) => (
      <Chip
        key={type}
        label={counts[type] != null ? `${type} (${counts[type]})` : type}
        onClick={() => onChange(type)}
        color={value === type ? "primary" : "default"}
        variant={value === type ? "filled" : "outlined"}
        size="small"
        sx={{ cursor: "pointer", fontWeight: value === type ? 600 : 400 }}
      />
    ))}
  </Box>
);

export default FilterBar;
