import { Dropdown } from "flowbite-react";
import { FC, useEffect, useState } from "react";

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  setDuration: (value: number) => void;
};

const durations = [
  {
    label: "An Hour",
    value: 3600,
  },
  {
    label: "3 Hours",
    value: 3600 * 3,
  },
  {
    label: "6 Hours",
    value: 3600 * 6,
  },
  {
    label: "12 Hours",
    value: 3600 * 12,
  },
  {
    label: "A Day",
    value: 3600 * 24,
  },
  {
    label: "An Week",
    value: 3600 * 24 * 7,
  },
  {
    label: "2 Weeks",
    value: 3600 * 24 * 14,
  },
  {
    label: "A Month",
    value: 3600 * 24 * 30,
  },
  {
    label: "3 Months",
    value: 3600 * 24 * 30 * 3,
  },
  {
    label: "6 Months",
    value: 3600 * 24 * 30 * 6,
  },
];

export const DurationInput: FC<Props> = ({ setDuration }) => {
  const [index, setIndex] = useState<number>(3);

  useEffect(() => {
    // eslint-disable-next-line security/detect-object-injection
    setDuration(durations[index].value);
  }, [index, setDuration]);

  return (
    <Dropdown
      // eslint-disable-next-line security/detect-object-injection
      label={durations[index].label}
      dismissOnClick={true}
      color="gray"
    >
      {durations.map((item, index) => (
        <Dropdown.Item key={index} onClick={() => setIndex(index)}>
          {item.label}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};
