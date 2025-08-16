import { NavLink, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { assets } from "./../assets/assets.js";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setCartItems({});
  };
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>
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
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        <div className="group relative">
          {/* Drop down */}
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu pt-4 right-0  ">
              <ul className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100  text-gray-500 rounded">
                <li>
                  <p
                    onClick={() => navigate("/profile")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </p>
                </li>
                <li>
                  <p
                    onClick={() => navigate("/orders")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </p>
                </li>
                <li>
                  <p
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>
        <NavLink to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 cursor-pointer" alt="" />
          <p className="absolute top-[10px] right-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square text-[6px] rounded-full">
            {getCartCount()}
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
          <NavLink onClick={false} className="py-2 pl-6 border" to="/">
            Home
          </NavLink>
          <NavLink
            onClick={false}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection{" "}
          </NavLink>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/about">
            About
          </NavLink>
          <NavLink onClick={false} className="py-2 pl-6 border" to="/contact">
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
