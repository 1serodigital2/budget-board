interface SubmitType {
  isPending: boolean;
}

const Submit = ({ isPending }: SubmitType) => {
  return (
    <button className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer">
      {isPending ? "Submitting" : "Submit"}
      {!isPending && "Submit"}
    </button>
  );
};

export default Submit;
