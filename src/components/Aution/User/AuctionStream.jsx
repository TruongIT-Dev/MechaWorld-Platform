import { useEffect, useState } from 'react';

function AuctionStream({ auctionId }) {
  const [events, setEvents] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);

  useEffect(() => {
    const connect = () => {
      const source = new EventSource(`/v1/auctions/${auctionId}/stream`);

      source.onopen = () => {
        console.log('Connected to SSE for auction:', auctionId);
      };

      source.onerror = () => {
        console.error('SSE connection error, retrying in 5 seconds...');
        setTimeout(() => {
          source.close();
          connect(); // Reconnect
        }, 5000);
      };

      // Lắng nghe sự kiện new_participant
      source.addEventListener('new_participant', (event) => {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, { type: 'new_participant', data }]);
        setParticipants(data.total_participants);
        console.log('New participant:', data);
      });

      // Lắng nghe sự kiện new_bid
      source.addEventListener('new_bid', (event) => {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, { type: 'new_bid', data }]);
        setCurrentPrice(data.current_price);
        console.log('New bid:', data);
      });

      // Lắng nghe sự kiện auction_ended
      source.addEventListener('auction_ended', (event) => {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, { type: 'auction_ended', data }]);
        setIsEnded(true);
        setWinnerInfo({
          winner: data.winner,
          finalPrice: data.final_price,
          reason: data.reason
        });
        
        // Nếu kết thúc bởi mua ngay, cập nhật thông tin bid cuối
        if (data.reason === 'buy_now_price_reached' && data.bid_details) {
          setCurrentPrice(data.bid_details.bid_amount);
        }
        
        console.log('Auction ended:', data);
        source.close(); // Đóng kết nối khi auction kết thúc
      });

      // Cleanup khi component unmount
      return () => {
        source.close();
        console.log('Disconnected from SSE');
      };
    };

    connect();
  }, [auctionId]);

  return (
    <div>
      <h2>Auction {auctionId}</h2>
      {isEnded ? (
        <div className="auction-ended">
          <h3>Auction Ended!</h3>
          {winnerInfo && (
            <div>
              <p>Winner: {winnerInfo.winner.full_name}</p>
              <p>Final Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(winnerInfo.finalPrice)}</p>
              <p>Reason: {winnerInfo.reason === 'buy_now_price_reached' ? 'Buy Now' : 'Time Ended'}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="auction-active">
          <p>Current Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice)}</p>
          <p>Participants: {participants}</p>
        </div>
      )}
      
      <h3>Event History</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            Type: {event.type}, Data: {JSON.stringify(event.data)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionStream;
