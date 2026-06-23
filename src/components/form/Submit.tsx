interface SubmitType {
  isPending?: boolean;
  type?: "submit" | "reset";
  label?: string;
}

const Submit = ({ isPending, type = "submit" }: SubmitType) => {
  return (
    <button
      type={type}
      className={`${type == "submit" ? "bg-(--color-primary)" : "bg-(--color-primary)"} py-2 px-3 text-white rounded-lg cursor-pointer text-[.8rem]`}
      disabled={isPending ? true : false}
    >
      {type === "submit" && (isPending ? "Submitting" : "Submit")}
      {type === "reset" && "X  Clear"}
    </button>
  );
};

export default Submit;
