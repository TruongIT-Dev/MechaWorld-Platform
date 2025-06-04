// GundamAuctionDetail.jsx
import React, { useEffect, useState } from 'react';
import { GetGundamDetailByID } from '../../../apis/Gundams/APIGundam';
import { Title, Caption } from '../Design';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const GundamAuctionDetail = ({ gundamId }) => {
  const [gundamDetail, setGundamDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchGundamDetail = async () => {
      try {
        setLoading(true);
        const response = await GetGundamDetailByID(gundamId);
        setGundamDetail(response.data);
      } catch (error) {
        console.error('Error fetching gundam detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gundamId) {
      fetchGundamDetail();
    }
  }, [gundamId]);

  // Thêm hàm map condition
  const mapCondition = (condition) => {
    switch ((condition || '').toLowerCase()) {
      case 'new':
        return 'Hàng mới';
      case 'open box':
        return 'Đã mở hộp';
      case 'used':
        return 'Đã sử dụng';
      default:
        return condition || 'Không rõ';
    }
  };

  if (loading) return <div className="text-center py-4">Đang tải thông tin Gundam...</div>;
  if (!gundamDetail) return <div className="text-center py-4 text-red-500">Không tìm thấy thông tin Gundam</div>;

  // Kiểm tra nếu có ảnh phụ thì hiển thị slider, không thì chỉ hiển thị ảnh chính
  const hasSecondaryImages = gundamDetail.secondary_image_urls && gundamDetail.secondary_image_urls.length > 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Title level={3} className="mb-4">Thông tin chi tiết Gundam</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phần hình ảnh */}
        <div>
          {hasSecondaryImages ? (
            <>
              {/* Slider ảnh chính với navigation */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <Swiper
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Navigation, Thumbs]}
                  className="main-swiper"
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                >
                  {/* Ảnh chính */}
                  <SwiperSlide>
                    <img
                      src={gundamDetail.primary_image_url || '/default-gundam.png'}
                      alt={gundamDetail.name}
                      className="w-full h-96 object-contain bg-gray-100"
                    />
                  </SwiperSlide>
                  
                  {/* Các ảnh phụ */}
                  {gundamDetail.secondary_image_urls.map((img, index) => (
                    <SwiperSlide key={`secondary-${index}`}>
                      <img
                        src={img}
                        alt={`${gundamDetail.name} - ${index + 1}`}
                        className="w-full h-96 object-contain bg-gray-100"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail slider */}
              <div className="mt-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  className="thumbnail-swiper"
                >
                  {/* Thumbnail ảnh chính */}
                  <SwiperSlide>
                    <div className={`border-2 ${activeImageIndex === 0 ? 'border-blue-500' : 'border-transparent'} rounded cursor-pointer`}>
                      <img
                        src={gundamDetail.primary_image_url}
                        alt="Thumbnail"
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  </SwiperSlide>

                  {/* Thumbnail các ảnh phụ */}
                  {gundamDetail.secondary_image_urls.map((img, index) => (
                    <SwiperSlide key={`thumb-${index}`}>
                      <div className={`border-2 ${activeImageIndex === index + 1 ? 'border-blue-500' : 'border-transparent'} rounded cursor-pointer`}>
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            // Chỉ hiển thị ảnh chính nếu không có ảnh phụ
            <img
              src={gundamDetail.primary_image_url || '/default-gundam.png'}
              alt={gundamDetail.name}
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
        
        {/* Phần thông tin chi tiết */}
        <div>
          <div className="mb-4">
            <Title level={4}>{gundamDetail.name}</Title>
            <Caption>Phiên bản: {gundamDetail.version}</Caption>
          </div>
          
          <div className="space-y-3">
            <div>
              <Title level={6}>Hãng sản xuất: {gundamDetail.manufacturer}</Title>
            </div>
            
            <div>
              <Title level={6}>Grade: {gundamDetail.grade}</Title>
            </div>

            <div>
              <Title level={6}>Series: {gundamDetail.series}</Title>
            </div>

            <div>
              <Title level={6}>Tổng số mảnh: {gundamDetail.parts_total}</Title>
            </div>

            <div>
              <Title level={6}>Hãng sản xuất: {gundamDetail.manufacturer}</Title>
            </div>
            
            <div>
              <Title level={6}>Tỉ lệ: {gundamDetail.scale}</Title>
            </div>

            <div>
              <Title level={6}>Năm phát hành: {gundamDetail.release_year}</Title>
            </div>

            <div>
              <Title level={6}>Cân nặng: {gundamDetail.weight} g</Title>
            </div>
            
            <div>
              <Title level={6}>Tình trạng: {mapCondition(gundamDetail.condition)}</Title>
            </div>

            <div>
              <Title level={6}>Mô tả:</Title>
              <Caption>{gundamDetail.description || 'Không có mô tả'}</Caption>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .main-swiper {
          height: 24rem;
          background-color: #f3f4f6;
        }
        
        .thumbnail-swiper {
          padding: 4px;
        }
        
        .thumbnail-swiper .swiper-slide {
          opacity: 0.6;
          transition: opacity 0.3s;
        }
        
        .thumbnail-swiper .swiper-slide-thumb-active {
          opacity: 1;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: #3b82f6;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default GundamAuctionDetail;