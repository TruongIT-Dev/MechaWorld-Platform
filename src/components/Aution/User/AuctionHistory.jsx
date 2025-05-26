import React from 'react';
import { Title } from '../Design';

const AuctionHistory = ({ bidHistory = [] }) => {
  return (
    <div className="">
      {/* Bid History */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-[30px]">
        <Title level={5} className="mb-4">Lịch sử đấu giá ({bidHistory.length})</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Thời gian</th>
                <th className="px-4 py-2 text-left">Người đấu</th>
                <th className="px-4 py-2 text-left">Giá</th>
              </tr>
            </thead>
            <tbody>
              {bidHistory.length > 0 ? (
                bidHistory.map((bid, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{new Date(bid.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{bid.user?.full_name || 'Ẩn danh'}</td>
                    <td className="px-4 py-3 font-medium">{bid.price?.toLocaleString() || '0'} VNĐ</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Chưa có lịch sử đấu giá
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AuctionHistory;