import React from 'react';

import { FormControl, Select, MenuItem } from '@material-ui/core';

interface ChoosePriceProps {
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

const ChoosePrice: React.FC<ChoosePriceProps> = ({ price, setPrice }) => {
  return (
    <>
      <FormControl variant="standard">
        <Select
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        >
          <MenuItem value={0}>0€</MenuItem>
          <MenuItem value={2}>2€</MenuItem>
          <MenuItem value={3}>3€</MenuItem>
          <MenuItem value={4}>4€</MenuItem>
          <MenuItem value={5}>5€</MenuItem>
          <MenuItem value={6}>6€</MenuItem>
          <MenuItem value={7}>7€</MenuItem>
          <MenuItem value={8}>8€</MenuItem>
          <MenuItem value={9}>9€</MenuItem>
          <MenuItem value={10}>10€</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default ChoosePrice;
