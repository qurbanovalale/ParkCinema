// DateComponent.jsx
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function BasicDatePicker({ onDateChange }) {
  const [value, setValue] = React.useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
    onDateChange(newValue); // seçilən tarixi parent-ə ötür
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Tarix seç"
        format="DD.MM.YYYY"
        views={['year', 'month', 'day']}
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
