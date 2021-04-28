// Old code in case fukked up something:

// import React from 'react';

// import { FormControl, Select, MenuItem } from '@material-ui/core';

// interface ChoosePriceProps {
//   price: number;
//   setPrice: React.Dispatch<React.SetStateAction<number>>;
// }

// const ChoosePrice: React.FC<ChoosePriceProps> = ({ price, setPrice }) => {
//   return (
//     <>
//       <FormControl variant="standard">
//         <Select
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//         >
//           <MenuItem value={0}>0€</MenuItem>
//           <MenuItem value={2}>2€</MenuItem>
//           <MenuItem value={3}>3€</MenuItem>
//           <MenuItem value={4}>4€</MenuItem>
//           <MenuItem value={5}>5€</MenuItem>
//           <MenuItem value={6}>6€</MenuItem>
//           <MenuItem value={7}>7€</MenuItem>
//           <MenuItem value={8}>8€</MenuItem>
//           <MenuItem value={9}>9€</MenuItem>
//           <MenuItem value={10}>10€</MenuItem>
//         </Select>
//       </FormControl>
//     </>
//   );
// };

// export default ChoosePrice;

import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    prices: {
      display: 'flex',
      marginLeft: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        display: 'inline-grid',
      },
    },
  })
);

interface ChoosePriceProps {
  price: number;
  setPrice: (newPrice: number) => void;
}

const ChoosePrice: React.FC<ChoosePriceProps> = ({ price, setPrice }) => {
  const classes = useStyles();
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="price"
        name="price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      >
        <div className={classes.prices}>
          <FormControlLabel value={0} control={<Radio />} label="Ilmainen" />
          <FormControlLabel
            value={5}
            disabled
            control={<Radio />}
            label="Maksullinen"
          />{' '}
        </div>
      </RadioGroup>
    </FormControl>
  );
};

export default ChoosePrice;
