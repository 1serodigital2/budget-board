interface SubmitType {
  isPending?: boolean;
}

const Submit = ({ isPending }: SubmitType) => {
  return (
    <button className="bg-[#1e3a8a] py-2 px-4 h-11.5 text-white rounded-xl cursor-pointer">
      {isPending ? "Submitting" : "Submit"}
    </button>
  );
};

export default Submit;
