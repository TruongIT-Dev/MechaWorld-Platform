import React from "react";
import { FaStar } from "react-icons/fa6";

import Img1 from "../../../assets/image/gun1.jpg";
import Img2 from "../../../assets/image/gun2.jpg";
import Img3 from "../../../assets/image/gun3.jpg";
import Img4 from "../../../assets/image/gun4.jpg";
import Img5 from "../../../assets/image/gun5.jpg";
import Img6 from "../../../assets/image/gun6.jpg";
import Img7 from "../../../assets/image/gun7.jpg";
import Img8 from "../../../assets/image/gun8.jpg";
import Img9 from "../../../assets/image/gun9.jpg";
import Img10 from "../../../assets/image/gun10.jpg";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Unicorn",
    rating: 5.0,
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Gundam Exia",
    rating: 4.5,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Gundam RX-78-2",
    rating: 4.7,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Gundam Aerial",
    rating: 4.4,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "Gundam Pharact HG",
    rating: 4.5,
    aosDelay: "800",
  },
  {
    id: 6,
    img: Img6,
    title: "Gundam Michaelis HG",
    rating: 5.0,
    aosDelay: "0",
  },
  {
    id: 7,
    img: Img7,
    title: "Gundam Schwarzette",
    rating: 4.5,
    aosDelay: "200",
  },
  {
    id: 8,
    img: Img8,
    title: "Gundam Calibarn HG",
    rating: 4.7,
    aosDelay: "400",
  },
  {
    id: 9,
    img: Img9,
    title: "Gundam Lfrith HG",
    rating: 4.4,
    aosDelay: "600",
  },
  {
    id: 10,
    img: Img10,
    title: "Bandai HGUC RGM-79",
    rating: 4.5,
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" data-aos-once="true" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" data-aos-once="true" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" data-aos-once="true" className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit
            asperiores modi Sit asperiores modi
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                data-aos-once="true"
                key={data.id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[220px] w-[150px] object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  <p className="text-sm text-gray-600">{data.color}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating}</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="text-center mt-10 cursor-pointer bg-blue-400 text-white py-1 px-5 rounded-md">
                    Xem chi tiết
                  </button>
                </div>
              </div>

            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;
