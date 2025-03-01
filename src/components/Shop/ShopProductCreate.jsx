import { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, InputNumber } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { PostGundam,GetGrades } from "../../apis/Product/APIProduct";
import ImageUpload from "./ImageUpload";

const { Option } = Select;

const ShopProductCreate = ({ setIsCreating }) => {
  const [form] = Form.useForm();
  const user = JSON.parse(Cookies.get("user")); // Lấy user từ cookies
  const [condition, setCondition] = useState("new");
  const [grades, setGrades] = useState([]);
//   const [images, setImages] = useState([]); // Lưu ảnh upload
  const [primaryImage, setPrimaryImage] = useState(null); // Ảnh chính
  const [secondaryImages, setSecondaryImages] = useState([]); // Khởi tạo với mảng rỗng
  const [price, setPrice] = useState(null);
  const [accessories, setAccessories] = useState([{ name: "", quantity: 1 }]);



  // Danh sách phân khúc Gundam
  const scaleOptions = ["1/144", "1/100", "1/60", "1/48"];
  const conditionOptions = {
    new: "Hộp mới nguyên dạng, chưa bóc seal, linh kiện không bị hư hại, đủ phụ kiện đi kèm",
    "open box": "Đã mở hộp, có thể đã thiếu phụ kiện hoặc có vết trầy xước nhẹ",
    "second hand": "Sản phẩm đã qua sử dụng, có dấu hiệu hao mòn hoặc đã được lắp ráp",
  };
  useEffect(() => {
    GetGrades()
      .then((response) => {
        setGrades(response.data); // Lưu danh sách grade từ API
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phân khúc:", error);
      });
  }, []);
  const handlePriceChange = (value) => {
    setPrice(value);
  };
  // Xử lý khi người dùng chọn ảnh
//   const handleImageUpload = ({ file }) => {
//     if (images.length >= 5) {
//       message.error("Chỉ được chọn tối đa 5 ảnh!");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const newImage = { url: e.target.result, file };
//       setImages([...images, newImage]);

//       // Nếu chưa có ảnh chính, đặt ảnh đầu tiên làm ảnh chính
//       if (!primaryImage) setPrimaryImage(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

  // Xóa ảnh khỏi danh sách
//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);

//     // Nếu ảnh chính bị xóa, chọn ảnh đầu tiên còn lại làm ảnh chính
//     // if (images[index].url === primaryImage && newImages.length > 0) {
//     //   setPrimaryImage(newImages[0].url);
//     // } else if (newImages.length === 0) {
//     //   setPrimaryImage(null);
//     // }
//   };

  // Xử lý giá trị tiền tệ (12,000 VNĐ)
//   const formatPrice = (value) => {
//     return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

// const handleFinish = (values) => {
//     console.log("Dữ liệu nhập:", values); // Kiểm tra dữ liệu đã nhập trước khi gửi API
  
//     const productData = {
//       ...values,
//       user_id: user.id,
//       condition_description: conditionOptions[values.condition] || values.condition_description,
//       primary_image: images.find((img) => img.url === primaryImage)?.file || null,
//       secondary_images: images.filter((img) => img.url !== primaryImage).map((img) => img.file),
//     };
  
//     console.log("Dữ liệu gửi API:", productData); // Kiểm tra dữ liệu gửi API
  
//     if (!productData.primary_image) {
//       message.error("Vui lòng chọn ít nhất 1 ảnh làm ảnh chính!");
//       return;
//     }
  
//     PostGundam(user.id, productData)
//       .then(() => {
//         message.success("Sản phẩm đã được đăng ký thành công!");
//         form.resetFields();
//         setImages([]);
//         setPrimaryImage(null);
//         setIsCreating(false);
//       })
//       .catch((err) => {
//         message.error("Lỗi đăng ký sản phẩm: " + err.message);
//         console.log(err);
//       });
//   };
// 🛠 Xử lý thêm dòng nhập phụ kiện
const handleAddAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1 }]);
  };
  
  // 🛠 Xóa dòng phụ kiện
  const handleRemoveAccessory = (index) => {
    setAccessories(accessories.filter((_, i) => i !== index));
  };
  
  // 🛠 Cập nhật giá trị nhập vào
  const handleAccessoryChange = (index, field, value) => {
    const newAccessories = [...accessories];
    newAccessories[index][field] = value;
    setAccessories(newAccessories);
  };


const handleFinish = (values) => {
    const hideLoading = message.loading("Đang xử lý...", 0);
    const formData = new FormData();
    console.log(values);
    formData.append("name", values.name);
    formData.append("grade_id", values.grade_id);
    formData.append("condition", values.condition);
    formData.append("manufacturer", values.manufacturer);
    formData.append("scale", values.scale);
    formData.append("weight", values.weight);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("condition_description", values.condition_description);
    
    console.log("1st img",primaryImage);
    console.log("2nd img",secondaryImages);
    // 🖼️ Thêm ảnh chính (primary_image)
    formData.append("primary_image", primaryImage.file);
      console.log("qua bước này")
    secondaryImages.forEach((file) => {
        console.log(file);
        formData.append("secondary_images", file.originFileObj);
    })
    accessories.forEach((item) => {
        const accessoryData = JSON.stringify({ name: item.name, quantity: item.quantity });
        formData.append("accessory", accessoryData);
      });
    // 🖼️ Thêm ảnh phụ (secondary_images[])
    // images
    //   .filter((img) => img.url !== primaryImage)
    //   .forEach((img) => {
    //     formData.append(`secondary_images`, img.file); // Axios tự động nhận diện mảng
    //   });
    //   console.log(formData);
    PostGundam(user.id, formData)
    .then((response) => {
      hideLoading();
      if (response.status === 200) {
        message.success("Sản phẩm đã được đăng ký thành công!");
        form.resetFields();
        setPrimaryImage(null);
        setIsCreating(false);
      }
    })
    .catch(() => {
      hideLoading();
      message.error("Lỗi khi đăng ký sản phẩm! Vui lòng thử lại.");
    });
  };
//   const handlePrimaryImageUpload = ({ file }) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPrimaryImage({ url: e.target.result, file }); // Lưu ảnh bìa
//     };
//     reader.readAsDataURL(file);
//   };
  

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Thêm Sản Phẩm Mới</h2>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Tên Gundam" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="grade_id" label="Phân khúc" rules={[{ required: true, message: "Vui lòng chọn phân khúc!" }]}>
            <Select placeholder="Chọn phân khúc">
                {grades.map((grade) => (
                <Option key={grade.id} value={grade.id}>
                    {grade.display_name} {/* Hiển thị display_name nhưng gửi id */}
                </Option>
                ))}
            </Select>
        </Form.Item>

        <Form.Item name="condition" label="Điều kiện sản phẩm" rules={[{ required: true }]}>
          <Select value={condition} onChange={setCondition}>
            <Option value="new">Hàng mới</Option>
            <Option value="open box">Đã mở hộp</Option>
            <Option value="second hand">Đã qua sử dụng</Option>
          </Select>
        </Form.Item>

        {condition !== "new" && (
          <Form.Item name="condition_description" label="Mô tả tình trạng">
            <Input.TextArea placeholder="Nhập mô tả chi tiết..." />
          </Form.Item>
        )}

        <Form.Item name="manufacturer" label="Thương hiệu" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="scale" label="Kích thước" rules={[{ required: true }]}>
          <Select placeholder="Chọn kích thước">
            {scaleOptions.map((scale) => (
              <Option key={scale} value={scale}>
                {scale}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item name="weight" label="Cân nặng (để tính phí vận chuyển)" rules={[{ required: true }]}>
          <Input type="number" min={1} suffix="gram" />
          <small className="text-gray-500">* Để tính toán chi phí vận chuyển</small>
        </Form.Item> */}
        <Form.Item 
            name="weight" 
            label="Cân nặng (để tính phí vận chuyển)" 
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
        >
            <InputNumber
                min={1}
                addonAfter="gram"
                style={{ width: "100%" }}
                parser={(value) => value.replace(/[^0-9]/g, "")}
            />
        </Form.Item>

        <Form.Item name="description" label="Mô tả sản phẩm" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Phụ kiện">
            {accessories.map((accessory, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                <Input
                    placeholder="Tên phụ kiện"
                    value={accessory.name}
                    onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
                />
                <InputNumber
                    min={1}
                    placeholder="Số lượng"
                    value={accessory.quantity}
                    onChange={(value) => handleAccessoryChange(index, "quantity", value)}
                />
                <Button danger onClick={() => handleRemoveAccessory(index)}>❌</Button>
                </div>
            ))}
            <Button type="dashed" onClick={handleAddAccessory}>➕ Thêm Phụ Kiện</Button>
        </Form.Item>

        <Form.Item
            label="Giá bán"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
        >
            <InputNumber
                value={price}
                onChange={handlePriceChange}
                min={0}
                style={{ width: "100%" }}
                formatter={(value) => 
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                // parser={(value) => value.replace(/,|VNĐ/g, "")} // Chuyển về số nguyên
                parser={(value) => value.replace(/[^0-9]/g, "")}
                suffix="VNĐ"
            />
        </Form.Item>

        {/* Upload hình ảnh */}
        {/* <Form.Item label="Ảnh bìa (1 ảnh)">
            <Upload
                showUploadList={false}
                customRequest={handlePrimaryImageUpload}
                accept="image/*"
                maxCount={1} // Chỉ cho phép chọn 1 ảnh
            >
                <Button icon={<UploadOutlined />}>Tải ảnh bìa lên</Button>
            </Upload>

        {primaryImage && (
            <div className="mt-2">
            <img src={primaryImage.url} alt="Ảnh bìa" className="w-20 h-20 border" />
            </div>
        )}
        </Form.Item>

        <Form.Item label="Hình ảnh phụ (Tối đa 5 ảnh)">
          <Upload showUploadList={false} multiple customRequest={handleImageUpload} accept="image/*">
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
          <div className="flex mt-2">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img.url} alt="Uploaded" className="w-20 h-20 object-cover border mr-2" />
                <Button
                  type="text"
                  danger
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0"
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </Form.Item> */}
        <Form.Item label="Tải lên hình ảnh">
            <ImageUpload 
                // onImagesChange={(data) => form.setFieldsValue(data)}  
                primaryImage={primaryImage} 
                setPrimaryImage={setPrimaryImage}
                secondaryImages={secondaryImages} 
                setSecondaryImages={setSecondaryImages} />
        </Form.Item>




        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-[#0056b3] hover:bg-[#4a90e2]">
            Đăng kí sản phẩm
          </Button>
          <Button onClick={() => setIsCreating(false)} className="ml-2">
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

ShopProductCreate.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};

export default ShopProductCreate;
