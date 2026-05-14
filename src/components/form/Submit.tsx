const Submit = ({ isPending }) => {
  return (
    <button className="bg-[#1e3a8a] p-3 text-white rounded-xl cursor-pointer">
      {isPending ? "Submitting" : "Submit"}
    </button>
  );
};

export default Submit;
