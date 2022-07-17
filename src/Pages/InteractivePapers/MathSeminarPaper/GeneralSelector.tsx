import React, { useState } from "react";

type Props = {
  options: { [name: string]: any };
  setValue: (newValue: any) => void;
};

const GeneralSelector: React.FC<Props> = ({ options, setValue }) => {
  const [key, setKey] = useState<string>();

  const updateKey = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setKey(selected);
    setValue(() => options[selected]);
  };

  return (
    <select onChange={updateKey} value={key}>
      {Object.keys(options).map((name, index) => (
        <option value={name} key={index}>
          {name}
        </option>
      ))}
    </select>
  );
};

export default GeneralSelector;
