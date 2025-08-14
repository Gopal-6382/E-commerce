import React from "react";
import Title from "./../components/Title";
import { assets } from "./../assets/assets";
import NewsletterBox from "./../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"About"} text2={"Us"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            We are a team of passionate individuals dedicated to making a
            difference.
          </p>
          <p>Our mission is to provide the best services to our customers.</p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            To empower individuals and businesses to achieve their goals through
            innovative solutions.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"Why"} text2={"Choose Us"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20 ">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            We ensure the highest quality standards in our products and
            services.
          </p>
        </div>
        <div className="border px-10 md:px-16  py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            We provide a seamless and user-friendly experience for our
            customers.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional customer service:</b>
          <p className="text-gray-600">
            We prioritize our customers and strive to provide the best support
            possible.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
