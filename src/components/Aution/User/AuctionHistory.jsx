import React from 'react';
import { Title } from '../Design';
import { AiOutlinePlus } from 'react-icons/ai';

const AuctionHistory = ({ participants = [], bidHistory = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bid History */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
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

      {/* Participants */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Title level={5} className="mb-4">Người tham gia ({participants.length})</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Người đấu</th>
                <th className="px-4 py-2 text-left">Tham gia lúc</th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 flex items-center gap-2">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <AiOutlinePlus />
                        </div>
                      )}
                      {user.full_name || 'Ẩn danh'}
                    </td>
                    <td className="px-4 py-3">{new Date().toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                    Chưa có người tham gia
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