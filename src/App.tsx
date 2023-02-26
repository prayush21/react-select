import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Select, SelectOption } from "./Select";

const options = [
  { label: "first", value: 1 },
  { label: "second", value: 2 },
  { label: "third", value: 3 },
  { label: "fourth", value: 4 },
  { label: "fifth", value: 5 },
  { label: "sixth", value: 6 },
  { label: "seventh", value: 7 },
  { label: "eighth", value: 8 },
  { label: "tenth", value: 10 },
  { label: "ninth", value: 9 },
  { label: "eleventh", value: 11 },
  { label: "twelfth", value: 12 },
];

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOption[]>([options[0]]);

  return (
    <>
      <Select
        multiple={true}
        value={value2}
        options={options}
        onChange={setValue2}
      ></Select>
      <br />
      <Select value={value} options={options} onChange={setValue}></Select>
    </>
  );
}

export default App;
