import { useState } from "react";

import { Lineicons } from "@lineiconshq/react-lineicons";
import { ShieldDollarStroke } from "@lineiconshq/free-icons";

import { NavLink } from "react-router-dom";

const SideBarNavigation = () => {
  return (
    <div className="bg-(--color-sidebar) p-5 w-75">
      <div className="flex gap-3 items-center mb-5">
        <div className="bg-(--color-primary) w-8 h-8 rounded flex justify-center items-center shrink-0">
          <Lineicons
            icon={ShieldDollarStroke}
            size={20}
            color="white"
            strokeWidth={1.5}
          />
        </div>
        <h5 className="text-xl font-medium text-sidebar-accent-foreground font-family-mono">Budget Board</h5>
      </div>
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
        <li className="text-white mt-3">
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
        <li className="text-white mt-3">
          <NavLink to="/budget">Budget</NavLink>
        </li>
        <ul className="pl-4 pt-2">
          <li className="text-white mb-2">
            <NavLink to="/budget/add">Add Budget</NavLink>
          </li>
          <li className="text-white mb-2">
            <NavLink to="/budget">All Budget</NavLink>
          </li>
          <li className="text-white">
            <NavLink to="/budget/overview">Budget overview</NavLink>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default SideBarNavigation;
