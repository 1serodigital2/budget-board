interface SubmitType {
  isPending?: boolean;
  type?: "submit" | "reset";
  label?: string;
}

const Submit = ({ isPending, type = "submit" }: SubmitType) => {
  return (
    <button
      type={type}
      className={`${type == "submit" ? "bg-(--color-primary-dark)" : "bg-(--color-primary)"} py-2 px-4 h-11.5 text-white rounded-xl cursor-pointer`}
      disabled={isPending ? true : false}
    >
      {type === "submit" && (isPending ? "Submitting" : "Submit")}
      {type === "reset" && "X  Clear"}
    </button>
  );
};

export default Submit;
