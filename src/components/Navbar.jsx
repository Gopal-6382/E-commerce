import { NavLink } from "react-router-dom";
import { useState } from "react";
import { assets } from "./../assets/assets.js";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img src={assets.logo} className="w-36" alt="" />
      <ul className=" sm:flex gap-5 text-sm text-gray-700 hidden">
        <NavLink className="flex flex-col items-center gap-1" to="/">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink className="flex flex-col items-center gap-1" to="/collection">
          <p>Collection</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink className="flex flex-col items-center gap-1" to="/about">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink className="flex flex-col items-center gap-1" to="/contact">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
          <div className="group-hover:block hidden absolute dropdown-menu pt-4 right-0  ">
            <ul className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100  text-gray-500 rounded">
              <li>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <NavLink to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 cursor-pointer" alt="" />
          <p className="absolute top-[10px] right-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square text-[6px] rounded-full">
            0
          </p>
        </NavLink>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>
      {/* Side Bar menu for small screens */}
      <div
        className={` absolute top-0 bottom-0 overflow-hidden right-0 bg-white transition-all ${
          visible ? "w-full" : "w-0"
        } `}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/">Home</NavLink>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/collection">Collection </NavLink>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/about">About</NavLink>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/contact">Contact</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
