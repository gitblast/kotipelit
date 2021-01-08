import React from 'react';

import DateFnsUtils from '@date-io/date-fns';
import fiLocale from 'date-fns/locale/fi';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Typography } from '@material-ui/core';

interface ChooseDateProps {
  selected: Date | null;
  setSelected: React.Dispatch<React.SetStateAction<Date | null>>;
}

const ChooseDate: React.FC<ChooseDateProps> = ({ selected, setSelected }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fiLocale}>
      <Typography>Milloin haluat järjestää peli-illan?</Typography>
      <KeyboardDateTimePicker
        autoOk
        value={selected}
        onChange={setSelected}
        ampm={false}
        format="d. MMMM HH:mm"
        disablePast
      />
    </MuiPickersUtilsProvider>
  );
};

export default ChooseDate;
