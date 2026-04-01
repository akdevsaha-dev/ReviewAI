interface inputBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  type: React.HTMLInputTypeAttribute;
  ref?: React.Ref<HTMLInputElement>;
}

export const InputBox = ({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  type,
  ref,
}: inputBoxProps) => {
  return (
    <div className="w-full">
      <div className="dark:text-[white]/90 text-black mt-4">{label}</div>
      <input
        ref={ref}
        type={type}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        className="text-neutral-500 dark:text-neutral-300 focus:bg-neutral-100 dark:focus:bg-neutral-900 w-100 rounded-md mt-3 px-3 py-2 focus:outline-none border dark:border-neutral-800 focus:border focus:border-neutral-300"
        placeholder={placeholder}
      />
    </div>
  );
};

InputBox.displayName = "InputBox";
