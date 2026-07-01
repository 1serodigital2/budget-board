import { useState } from "react";
import DatePicker from "react-datepicker";

// @ts-ignore: side-effect import for CSS module
import "react-datepicker/dist/react-datepicker.css";

import { DateRange } from "../../types/expense";

interface DateRangePickerProps {
  handleInputChange: (data: { name: string; inputValue: any }) => void;
  inputValues?: DateRange;
}

const DateRangePicker = ({
  handleInputChange,
  inputValues,
}: DateRangePickerProps) => {
  return (
    <div className="w-[100%] max-w-72 w-[70%]">
      <DatePicker
        selectsRange
        startDate={inputValues?.start || null}
        endDate={inputValues?.end || null}
        onChange={(dates) => {
          const [start, end] = dates;
          handleInputChange({
            name: "dateRange",
            inputValue: {
              start,
              end,
            },
          });
        }}
        isClearable
        placeholderText="Select date range"
        dateFormat="dd-MM-yyyy"
        className="w-full border rounded-lg text-sm py-2 px-3"
        name="dateRange"
        autoComplete="off"
      />
    </div>
  );
};

export default DateRangePicker;
