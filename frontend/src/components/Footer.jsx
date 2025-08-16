import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      <div>
        <img src={assets.logo} className="mb-5 w-32" alt="" />
        <p className="w-full md:w-2/3 text-gray-600">
          Your trusted source for the latest news and updates.
        </p>
      </div>

      <div>
        <p className="text-xl font-medium">Company</p>
        <ul className="flex flex-col gap-1 text-gray-600">
          <li>Home </li>
          <li>About</li>
          <li>Delivery</li>
          <li>Privacy policy</li>
        </ul>
      </div>
      <div>
        <p className="text-xl font-medium mb-5">GET IN TOUCH </p>
        <ul className="flex flex-col gap-1 text-gray-600">
          <li>Email: contact@company.com</li>
          <li>Phone: (123) 456-7890</li>
          <li>Address: 123 Main St, Anytown, USA</li>
        </ul>
      </div>
      <div><hr />
      <p className="my-5 text-sm text-center">© 2023 Company Name. All rights reserved.</p></div>
    </div>
  );
};

export default Footer;
