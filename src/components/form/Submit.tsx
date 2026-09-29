interface SubmitType {
  isPending?: boolean;
  type?: "submit" | "reset";
  label?: string;
}

const Submit = ({ isPending, type = "submit", label }: SubmitType) => {
  return (
    <button
      type={type}
      className={`hover-lift py-2.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
        type === "submit"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
          : "bg-white/10 text-foreground hover:bg-white/20 border border-white/10"
      } ${isPending ? "opacity-70 cursor-not-allowed hover:translate-y-0" : "cursor-pointer"}`}
      disabled={isPending}
    >
      {type === "submit" && (isPending ? "Submitting..." : label || "Submit")}
      {type === "reset" && (label || "Clear")}
    </button>
  );
};

export default Submit;
