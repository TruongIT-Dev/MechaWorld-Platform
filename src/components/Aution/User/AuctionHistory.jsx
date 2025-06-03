import React from 'react';
import { Title } from '../Design';

const AuctionHistory = React.memo(({ bidHistory = [], participants = [] }) => {
  // Tạo map từ participants để dễ tra cứu thông tin user
  const participantsMap = React.useMemo(() => {
    const map = {};
    participants.forEach(participant => {
      if (participant.user_id) {
        map[participant.user_id] = {
          ...participant.user,
          full_name: participant.user?.full_name || `Người dùng ${participant.user_id.slice(0, 6)}`,
          avatar_url: participant.user?.avatar_url || '/default-avatar.png'
        };
      }
    });
    return map;
  }, [participants]);

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('vi-VN');
    } catch {
      return '--:--';
    }
  };

  // Sắp xếp bidHistory theo thời gian mới nhất trước
  const sortedBidHistory = React.useMemo(() => {
    return [...bidHistory].sort((a, b) => 
      new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at)
    );
  }, [bidHistory]);

  return (
    <div className="space-y-3">
      {sortedBidHistory.map((bid) => {
        // Lấy thông tin user theo thứ tự ưu tiên:
        // 1. Từ bid.user (nếu có)
        // 2. Từ participantsMap (nếu có bidder_id)
        // 3. Fallback mặc định
        const user = bid.user || 
                   (bid.bidder_id && participantsMap[bid.bidder_id]) || 
                   {
                     full_name: `Người dùng ${bid.bidder_id?.slice(0, 6) || 'ẩn danh'}`,
                     avatar_url: '/default-avatar.png'
                   };

        return (
          <div 
            key={`${bid.id || bid.bid_id}-${bid.timestamp || bid.created_at}`}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src={user.avatar_url} 
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = '/default-avatar.png'}
                />
              </div>
              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-xs text-gray-500">
                  {formatTime(bid.timestamp || bid.created_at)}
                </p>
              </div>
            </div>
            <div className="text-lg font-semibold text-green-600">
              {(bid.price || bid.amount)?.toLocaleString('vi-VN')}₫
            </div>
          </div>
        );
      })}
    </div>
  );
});
export default AuctionHistory;