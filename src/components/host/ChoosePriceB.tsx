import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

interface ChoosePriceProps {
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

const ChoosePriceB: React.FC<ChoosePriceProps> = () => {
  const [price, setPrice] = React.useState(0);
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="price"
        name="price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      >
        <FormControlLabel
          value={0}
          control={<Radio />}
          label="Vapaaehtoinen tippi"
        />

        <FormControlLabel value={2} disabled control={<Radio />} label="2€" />
        <FormControlLabel value={5} disabled control={<Radio />} label="5€" />
        <FormControlLabel value={10} disabled control={<Radio />} label="10€" />
      </RadioGroup>
    </FormControl>
  );
};

export default ChoosePriceB;
