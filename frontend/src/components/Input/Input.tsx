const Input = (data: {
  type: string;
  id: string;
  placeholder: string;
  className: string;
  required: boolean;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      type={data.type}
      id={data.id}
      className={data.className}
      placeholder={data.placeholder}
      required
      value={String(data.value)}
      onChange={data.onChange}
    />
  );
};

export default Input;
