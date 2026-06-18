import { NavLink } from "react-router-dom";

const SideBarNavigation = () => {
  return (
    <div className="bg-(--color-sidebar) w-75">
      <div className="flex gap-3 items-center mb-5 px-5 pt-5 border-b border-b-sidebar-border pb-5">
        <div className="bg-(--color-primary) w-8 h-8 rounded-[10px] flex justify-center items-center shrink-0">
          <span
            className="material-symbols-rounded"
            style={{
              fontVariationSettings: "'wght' 200",
              fontSize: 20,
              color: "white",
            }}
          >
            currency_rupee
          </span>
        </div>
        <div>
          <h5 className="text-[.9rem] font-medium text-sidebar-accent-foreground">
            Budget Board
          </h5>
          <div className="text-accent text-[.7rem]">Personal Finance</div>
        </div>
      </div>
      <ul className="px-3">
        <li className="text-white mb-3 font-mono text-[13px]">
          <NavLink
            to="/"
            className="flex gap-[.3rem] [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
          >
            <span
              className="material-symbols-rounded"
              style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
            >
              dashboard
            </span>
            <div>Dashboard</div>
          </NavLink>
        </li>
        <li className="text-white text-[13px]">
          <NavLink
            className="flex gap-[.3rem] [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
            to="/expenses"
          >
            <span
              className="material-symbols-rounded "
              style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
            >
              receipt_long
            </span>
            <div>Expenses</div>
          </NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white text-[13px] mb-2">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/expenses/add"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                add_circle
              </span>
              <div>Add Expense</div>
            </NavLink>
          </li>
          <li className="text-white text-[13px]">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/expenses"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                payments
              </span>
              <div>All Expense</div>
            </NavLink>
          </li>
        </ul>
        <li className="text-white text-[13px] mt-3">
          <NavLink
            className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
            to="/categories"
          >
            <span
              className="material-symbols-rounded"
              style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
            >
              bookmark_stacks
            </span>
            <div>Categories</div>
          </NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white text-[13px] mb-2">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/categories/add"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                add_circle
              </span>
              <div>Add Category</div>
            </NavLink>
          </li>
          <li className="text-white text-[13px]">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/categories"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                category
              </span>

              <div>All Categories</div>
            </NavLink>
          </li>
        </ul>
        <li className="text-white text-[13px] mt-3">
          <NavLink
            className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
            to="/budget"
          >
            <span
              className="material-symbols-rounded"
              style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
            >
              account_balance_wallet
            </span>
            <div>Budget</div>
          </NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white text-[13px] mb-2">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/budget/add"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                add_circle
              </span>
              <div>Add Budget</div>
            </NavLink>
          </li>
          <li className="text-white text-[13px] mb-2">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/budget"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                wallet
              </span>
              <div>All Budget</div>
            </NavLink>
          </li>
          <li className="text-white text-[13px]">
            <NavLink
              end
              className="flex gap-[.3rem]  [&.active]:bg-sidebar-accent p-1.5 rounded-[.6rem]"
              to="/budget/overview"
            >
              <span
                className="material-symbols-rounded"
                style={{ fontVariationSettings: "'wght' 200", fontSize: 20 }}
              >
                garage_money
              </span>
              <div>Budget overview</div>
            </NavLink>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default SideBarNavigation;
