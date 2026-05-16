import { useState } from "react";

import { NavLink } from "react-router-dom";

const SideBarNavigation = () => {
  return (
    <div className="bg-(--color-primary) p-10 w-75">
      <h5 className="text-3xl font-medium mb-5">Budget Board</h5>
      <ul>
        <li className="text-white mb-3">
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li className="text-white">
          <NavLink to="/expenses">Expenses</NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white mb-2">
            <NavLink to="/expenses/add">Add Expense</NavLink>
          </li>
          <li className="text-white">
            <NavLink to="/expenses">All Expense</NavLink>
          </li>
        </ul>
        <li className="text-white">
          <NavLink to="/categories">Categories</NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white mb-2">
            <NavLink to="/categories/add">Add Category</NavLink>
          </li>
          <li className="text-white">
            <NavLink to="/categories">All Categories</NavLink>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default SideBarNavigation;
