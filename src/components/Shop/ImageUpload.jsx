import { Upload, Button, message } from "antd";
import { UploadOutlined, 
    // InboxOutlined 
 } from "@ant-design/icons";
import PropTypes from 'prop-types';
// const { Dragger } = Upload;

const ImageUpload = ({ primaryImage, setPrimaryImage, secondaryImages, setSecondaryImages }) => {
//   const [primaryImage, setPrimaryImage] = useState(null);
//   const [secondaryImages, setSecondaryImages] = useState([]);

  // Xử lý chọn ảnh chính
  const handlePrimaryUpload = ({ file }) => {
    const selectedFile = file.originFileObj || file; // Đảm bảo lấy đúng file
    
    if (!selectedFile) {
      message.error("Lỗi: Không tìm thấy file hợp lệ!");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      setPrimaryImage({ url: e.target.result, file: selectedFile });
      message.success("Đã chọn ảnh chính!");
    };
    reader.readAsDataURL(selectedFile); // Đọc file để hiển thị trước khi upload
  };
  
// const handleUpload = ({ file }) => {
//           const reader = new FileReader();
//           reader.onload = (e) => {
//             const img = new Image();
//             img.src = e.target.result;
//             img.onload = async () => {
//             };
//           };
//           reader.readAsDataURL(file);
// };    
  // Xử lý ảnh bìa (chỉ chọn 1 ảnh)
//   const handlePrimaryUpload = ({ file }) => {
//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       setPrimaryImage(file);
//     //   setPreviewImages([{ url: fileURL }]); // Hiển thị ảnh bìa
//     }
//   };

  // Xử lý ảnh phụ (tối đa 5 ảnh)
  const handleSecondaryUpload = ({ fileList }) => {
    // Lọc danh sách ảnh mới chưa có trong secondaryImages
    const newFiles = fileList.filter(
      (file) => !secondaryImages.some((img) => img.uid === file.uid)
    );
    // Nếu tổng số ảnh mới + ảnh hiện tại > 5 thì báo lỗi
    if (secondaryImages.length + newFiles.length > 5) {
      message.error("Chỉ có thể tải lên tối đa 5 ảnh phụ!");
      return;
    }
    console.log("File list sau khi thay đổi:", fileList);
    // Cập nhật state chỉ với ảnh mới
    // setSecondaryImages([...secondaryImages, ...newFiles]);
    setSecondaryImages(fileList);
  };
  
  // Xử lý khi xóa ảnh
  const handleRemoveImage = (file) => {
    setSecondaryImages((prevImages) => prevImages.filter((img) => img.uid !== file.uid));
    console.log("đã xóa");
  };
  

  // Xóa ảnh phụ
//   const handleRemoveImage = (index) => {
//     const newImages = secondaryImages.filter((_, i) => i !== index);
//     setSecondaryImages(newImages);
//     console.log("xóa thành công")
//   };




//   const props = {
//     name: 'file',
//     multiple: true,
//     listType: "picture-card",
//     maxCount: 5,
//     action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
//     beforeUpload: (file) => {
//         console.log({ file });
//         return false;
//     },
//     onChange(info) {
//       const { status } = info.file;
//       let newFileList = [...info.fileList];
//       newFileList = newFileList.slice(-5);
//       newFileList = newFileList.map((file) => {
//         if (file.response) {
//           // Component will show file.url as link
//           file.url = file.response.url;
       
//         }
//         return file;
//       });
//       setSecondaryImages(newFileList);
//       console.log(secondaryImages);
//       if (status !== 'uploading') {
//         // console.log(info.file, info.fileList);
//       }
//       if (status === 'done') {
//         message.success(`${info.file.name} đẩy ảnh thành công`);
//       } else if (status === 'error') {
//         message.error(`${info.file.name} đẩy ảnh thất bại`);
//       }
//     },
//     onDrop(e) {
//       console.log('Dropped files', e.dataTransfer.files);
//     },
//   };

  return (
    <div>
      {/* Upload ảnh chính */}
      <div className="mb-4">
        <label label className="font-bold">
            <span className="text-red-500">*</span> Ảnh Chính
        </label>
        <br />
        <Upload showUploadList={false} beforeUpload={() => false} onChange={handlePrimaryUpload} accept="image/*">
          <Button icon={<UploadOutlined />}>Tải ảnh chính lên</Button>
        </Upload>
        {primaryImage && (
          <div className="mt-3">
            <img src={primaryImage.url} alt="Ảnh chính" className="w-[200px] h-[200px] object-cover border rounded-lg" />
          </div>
        )}
      </div>

      {/* Upload nhiều ảnh phụ */}
        <div className="mt-6">
        <label className="font-bold">
            <span className="text-red-500">*</span> Ảnh Phụ
        </label>
        <br />
        {/* <Upload multiple showUploadList={false} beforeUpload={() => false} onChange={handleSecondaryUpload} maxCount={5} accept="image/*">
          <Button icon={<UploadOutlined />}>Tải ảnh phụ lên</Button>
        </Upload> */}
        <Upload
            multiple
            listType="picture-card"
            fileList={secondaryImages}
            onChange={handleSecondaryUpload}
            onRemove={handleRemoveImage}
            beforeUpload={() => false} // Không tự động upload lên server
            maxCount={5} // Giới hạn tối đa 5 ảnh
        >
        {secondaryImages.length < 5 && "+ Thêm ảnh"}
        </Upload>
        {/* Hiển thị danh sách ảnh phụ */}
        {/* <div className="flex flex-wrap mt-4 gap-3">
          {secondaryImages.map((img, index) => (
            <div key={index} className="relative w-[200px] h-[200px] border rounded-lg overflow-hidden"> */}
              {/* Hiển thị ảnh */}
              {/* <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" /> */}

              {/* Nút xóa ảnh phụ */}
              {/* <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500"
                onClick={() => handleRemoveImage(index)}
              >
                <CloseCircleFilled />
              </button>
            </div>
          ))}
        </div> */}


      </div>
      {/*Test upload ảnh */}
      {/* <div>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
            <InboxOutlined />
            </p>
            <p className="ant-upload-text">Ấn hoặc thả ảnh vào đây</p>
            <p className="ant-upload-hint">
            </p>
        </Dragger>
      </div> */}
    </div>
  );
};
ImageUpload.propTypes = {
    primaryImage: PropTypes.object,
    setPrimaryImage: PropTypes.func.isRequired,
    secondaryImages: PropTypes.array.isRequired,
    setSecondaryImages: PropTypes.func.isRequired,
};

export default ImageUpload;
