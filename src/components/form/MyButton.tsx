import { Link, NavLink } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/helpers";
import { MyButtonTypes } from "../../types/FormTypes";

const MyButton = ({
  btnType,
  id,
  deleteFn,
  isPending,
  btnSlug,
}: MyButtonTypes) => {
  if (btnType === "edit" && btnSlug !== "") {
    return (
      <button className="text-blue-600 cursor-pointer bg-blue-100 rounded  hover:bg-blue-600 hover:text-white transition duration-200">
        <Link
          to={btnSlug || "/"}
          className=" text-[.7rem] flex items-center gap-1  py-1 px-2 "
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: ".8rem",
            }}
          >
            {btnType.toLowerCase()}
          </span>
          <span>{capitalizeFirstLetter(btnType)}</span>
        </Link>
      </button>
    );
  } else if (btnType === "delete" && id) {
    return (
      <button
        className="text-red-800 cursor-pointer flex items-center gap-1 text-[.7rem] bg-red-100 rounded py-1 px-2 hover:bg-red-700 hover:text-white transition duration-200"
        onClick={() => deleteFn?.(id)}
        disabled={isPending}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: ".8rem",
          }}
        >
          delete
        </span>
        {isPending ? "Deleting..." : "Delete"}
      </button>
    );
  } else if (btnType === "view") {
    return (
      <button className="text-green-600 cursor-pointer bg-green-100 rounded  hover:bg-green-600 hover:text-white transition duration-200">
        <NavLink
          to={btnSlug || "/"}
          className=" text-[.7rem] flex items-center gap-1 py-1 px-2 "
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: ".8rem",
            }}
          >
            visibility
          </span>
          <span>{capitalizeFirstLetter(btnType)}</span>
        </NavLink>
      </button>
    );
  }
};

export default MyButton;
