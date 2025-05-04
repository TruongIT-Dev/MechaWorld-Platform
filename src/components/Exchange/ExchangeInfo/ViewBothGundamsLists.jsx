import { Card, Tag, } from 'antd';
import { ArrowLeftRight } from 'lucide-react';
import PropTypes from 'prop-types';

const ViewBothGundamsLists = ({ currentGundam, partnerGundam }) => {
  // Determine which list belongs to current user vs partner based on isRequestUser flag


  return (
    <div className="w-full ">
      <h2 className="text-xl font-bold mb-4 text-center">Chi tiết trao đổi Gundam</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Current User's Gundams */}
        <div className="w-full md:w-5/12">
          <h3 className="text-lg font-semibold mb-3 text-center">Gundam của bạn</h3>
          <div className="space-y-4">
            {currentGundam?.items.length > 0 ? (
              currentGundam?.items.map((gundam) => (
                <Card
                  key={gundam.id}
                  hoverable
                  className="border border-blue-200 hover:border-blue-400 transition-all"
                  cover={
                    <div className="h-48 flex items-center justify-center bg-gray-50 p-2">
                      <img 
                        src={gundam.image_url} 
                        alt={gundam.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                  }
                >
                  <div className="space-y-2">
                    <h4 className="text-base font-medium">{gundam.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag color="blue">{gundam.grade}</Tag>
                      <Tag color="green">{gundam.scale}</Tag>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">Không có Gundam nào được chọn</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Arrow */}
        <div className="flex items-center justify-center py-4">
          <div className="bg-gray-100 rounded-full p-3">
            <ArrowLeftRight size={24} />
          </div>
        </div>

        {/* Partner's Gundams */}
        <div className="w-full md:w-5/12">
          <h3 className="text-lg font-semibold mb-3 text-center">Gundam của đối tác</h3>
          <div className="space-y-4">
            {partnerGundam?.items.length > 0 ? (
              partnerGundam?.items.map((gundam) => (
                <Card
                  key={gundam.id}
                  hoverable
                  className="border border-orange-200 hover:border-orange-400 transition-all"
                  cover={
                    <div className="h-48 flex items-center justify-center bg-gray-50 p-2">
                      <img 
                        src={gundam.image_url} 
                        alt={gundam.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                  }
                >
                  <div className="space-y-2">
                    <h4 className="text-base font-medium">{gundam.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag color="orange">{gundam.grade}</Tag>
                      <Tag color="green">{gundam.scale}</Tag>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">Không có Gundam nào được chọn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ViewBothGundamsLists.propTypes = {
  currentGundam: PropTypes.shape({
    items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      grade: PropTypes.string.isRequired,
      scale: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    })
  ),
  }),
  partnerGundam: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
        scale: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
      })
    ),
  })
};

export default ViewBothGundamsLists;