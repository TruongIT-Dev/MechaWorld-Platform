import React from 'react';
import { Body, Caption, Container, Title } from "../Design";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../Design";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";

const AutionDetail = () => {
    const [activeTab, setActiveTab] = useState("description");

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
    return (
      <>
        <section className="mt-10 pt-24 px-8">
          <Container>
            <div className="flex justify-between gap-8">
              <div className="w-1/2">
                <div className="h-[70vh]">
                  <img src="https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png" alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
              <div className="w-1/2">
                <Title level={2} className="capitalize">
                30MM 1/144 EXM-A9s Spinatio - Sengoku Type
                </Title>
                <div className="flex gap-5">
                  <div className="flex text-green ">
                    <IoIosStar size={20} />
                    <IoIosStar size={20} />
                    <IoIosStar size={20} />
                    <IoIosStarHalf size={20} />
                    <IoIosStarOutline size={20} />
                  </div>
                  <Caption>(2 customer reviews)</Caption>
                </div>
                <br />
                <Body>Korem ipsum dolor amet, consectetur adipiscing elit. Maece nas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla.</Body>
                <br />
                <Caption>Item condition: New</Caption>
                <br />
                <Caption>Item Verifed: Yes</Caption>
                <br />
                <Caption>Time left:</Caption>
                <br />
                <div className="flex gap-8 text-center">
                  <div className="p-5 px-10 shadow-s1">
                    <Title level={4}>149</Title>
                    <Caption>Days</Caption>
                  </div>
                  <div className="p-5 px-10 shadow-s1">
                    <Title level={4}>12</Title>
                    <Caption>Hours</Caption>
                  </div>
                  <div className="p-5 px-10 shadow-s1">
                    <Title level={4}>36</Title>
                    <Caption>Minutes</Caption>
                  </div>
                  <div className="p-5 px-10 shadow-s1">
                    <Title level={4}>51</Title>
                    <Caption>Seconds</Caption>
                  </div>
                </div>
                <br />
                <Title className="flex items-center gap-2">
                  Auction ends:
                  <Caption>March 30, 2025 12:00 am</Caption>
                </Title>
                <Title className="flex items-center gap-2 my-5">
                  Timezone: <Caption>UTC 0</Caption>
                </Title>
                <Title className="flex items-center gap-2 my-5">
                  Price:<Caption>500000 VNĐ </Caption>
                </Title>
                <Title className="flex items-center gap-2">
                  Current bid:<Caption className="text-3xl">1000000 VNĐ </Caption>
                </Title>
                <div className="p-5 px-10 shadow-2xl py-8"> 
                    <form className="flex gap-3 justify-between  p-5  rounded-lg">
                        <input className={commonClassNameOfInput} type="number" name="price" />
                        <button type="button" className="bg-gray-100 rounded-md px-5 py-3 shadow-md">
                        <AiOutlinePlus />
                        </button>
                        <button type="submit" className="py-3 px-8 rounded-lg bg-gray-400 text-gray-700 cursor-not-allowed shadow-md">
                        Submit
                        </button>
                    </form>
                </div>

              </div>
            </div>
            <div className="details mt-8">
              <div className="flex items-center gap-5">
                <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "description" ? " bg-black text-white" : "bg-white"}`} onClick={() => handleTabClick("description")}>
                  Description
                </button>
                <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "auctionHistory" ? "bg-black text-white" : "bg-white"}`} onClick={() => handleTabClick("auctionHistory")}>
                  Auction History
                </button>
                <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "reviews" ? "bg-black text-white" : "bg-white"}`} onClick={() => handleTabClick("reviews")}>
                  Reviews(2)
                </button>
                <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "moreProducts" ? "bg-black text-white" : "bg-white"}`} onClick={() => handleTabClick("moreProducts")}>
                  More Products
                </button>
              </div>
  
              <div className="tab-content mt-8">
                {activeTab === "description" && (
                  <div className="description-tab shadow-s3 p-8 rounded-md">
                    <Title level={4}>Giới thiệu mô hình:</Title>
                    <br />
                    <Caption className="leading-7">
                    • Xuất hiện đầy kiêu hãnh - Chiến binh Spinatio của thời kì Chiến Quốc.
                    <br />
                    • Được trang bị bộ giáp thời Chiến Quốc (Sengoku) đậm chất cổ trang.
                    <br />
                    • Quá trình lắp ráp dễ dàng, biên độ di chuyển cao.
                    <br />
                    • Khả năng custom vẫn được giữ nguyên như các mẫu 30MM khác, tạo ra tiềm năng sáng tạo với kit mà giới hạn chỉ ở trí tưởng tượng của bạn.
                    </Caption>
                    <br />
                    <Title level={4}>Product Overview</Title>
                    <div className="flex justify-between gap-5">
                      <div className="mt-4 capitalize w-1/2">
                        <div className="flex justify-between border-b py-3">
                          <Title>category</Title>
                          <Caption>Category</Caption>
                        </div>
                        <div className="flex justify-between border-b py-3">
                          <Title>Cấp độ </Title>
                          <Caption> 30MM </Caption>
                        </div>
                        <div className="flex justify-between border-b py-3">
                          <Title>Chiều cao mô hình:</Title>
                          <Caption> ~13cm </Caption>
                        </div>
                        <div className="flex justify-between border-b py-3">
                          <Title>Tỉ lệ</Title>
                          <Caption> 1/144</Caption>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <Title>Price</Title>
                          <Caption> 500000 VNĐ </Caption>
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <Title>verify</Title>
                          YES
                        </div>
                        <div className="flex justify-between py-3 border-b">
                          <Title>Create At</Title>
                          <Caption>March 01, 2025 12:00 am</Caption>
                        </div>
                        <div className="flex justify-between py-3">
                          <Title>Update At</Title>
                          <Caption>March 31, 2025 12:00 am</Caption>
                        </div>
                      </div>
                      <div className="w-1/2">
                        <div className="h-[60vh] p-2 bg-green rounded-xl">
                          <img src="https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png" alt="" className="w-full h-full object-cover rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "auctionHistory" && <AuctionHistory />}
                {activeTab === "reviews" && (
                  <div className="reviews-tab shadow-s3 p-8 rounded-md">
                    <Title level={5} className=" font-normal">
                      Reviews
                    </Title>
                    <hr className="my-5" />
                    <Title level={5} className=" font-normal text-red-500">
                      Cooming Soon!
                    </Title>
                  </div>
                )}
                {activeTab === "moreProducts" && (
                  <div className="more-products-tab shadow-s3 p-8 rounded-md">
                    <h1>More Products</h1>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  };

export default AutionDetail;

export const AuctionHistory = () => {
    return (
      <>
        <div className="shadow-s1 p-8 rounded-lg">
          <Title level={5} className=" font-normal">
            Auction History
          </Title>
          <hr className="my-5" />
  
          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-5">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Bid Amount(USD)
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Auto
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">December 31, 2024 12:00 am</td>
                  <td className="px-6 py-4">$200</td>
                  <td className="px-6 py-4">Sunil Pokhrel</td>
                  <td className="px-6 py-4"> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };