import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, InputNumber } from "antd";
import { InfoCircleOutlined, UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

import { GetGrades } from '../../apis/Gundams/APIGundam';
import { PostGundam } from "../../apis/User/APIUser";

import ImageUpload from "./ImageUpload";

const { Option } = Select;

const ShopProductCreate = ({ setIsCreating }) => {
  const [form] = Form.useForm();
  const user = JSON.parse(Cookies.get("user")); // Lấy user từ cookies
  const [condition, setCondition] = useState("");
  const [grades, setGrades] = useState([]);
//   const [images, setImages] = useState([]); // Lưu ảnh upload
  const [primaryImage, setPrimaryImage] = useState(null); // Ảnh chính
  const [secondaryImages, setSecondaryImages] = useState([]); // Khởi tạo với mảng rỗng
  const [price, setPrice] = useState(null);
  // const [accessories, setAccessories] = useState([{ name: "", quantity: 1 }]);
  const [accessories, setAccessories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const series =[
    {id: "Mobile Suit Gundam", name: "Mobile Suit Gundam"},
    {id: "Mobile Suit Zeta Gundam", name: "Mobile Suit Zeta Gundam"},
    {id: "Mobile Suit Gundam ZZ", name: "Mobile Suit Gundam ZZ"},
    {id: "Mobile Suit Victory Gundam", name: "Mobile Suit Victory Gundam"},
    {id: "Mobile Fighter G Gundam", name: "Mobile Fighter G Gundam"},
    {id: "Mobile Suit Gundam Wing", name: "Mobile Suit Gundam Wing"},
    {id: "After War Gundam X", name: "After War Gundam X"},
    {id: "Turn A Gundam", name: "Turn A Gundam"},
    {id: "Mobile Suit Gundam SEED", name: "Mobile Suit Gundam SEED"},
    {id: "Superior Defender Gundam Force", name: "Superior Defender Gundam Force"},
    {id: "Mobile Suit Gundam SEED Destiny", name: "Mobile Suit Gundam SEED Destiny"},
    {id: "Mobile Suit Gundam 00", name: "Mobile Suit Gundam 00"},
    {id: "SD Gundam Sangokuden Brave Battle Warriors", name: "SD Gundam Sangokuden Brave Battle Warriors"},
    {id: "Model Suit Gunpla Builders Beginning G", name: "Model Suit Gunpla Builders Beginning G"},
    {id: "Mobile Suit Gundam AGE", name: "Mobile Suit Gundam AGE"},
    {id: "Gundam Build Fighters", name: "Gundam Build Fighters"},
    {id: "Mobile Suit Gundam-san", name: "Mobile Suit Gundam-san"},
    {id: "Gundam Reconguista in G", name: "Gundam Reconguista in G"},
    {id: "Gundam Build Fighters Try", name: "Gundam Build Fighters Try"},
    {id: "Mobile Suit Gundam: Iron-Blooded Orphans", name: "Mobile Suit Gundam: Iron-Blooded Orphans"},
    {id: "Gundam Build Divers", name: "Gundam Build Divers"},
    {id: "SD Gundam World Sangoku Soketsuden", name: "SD Gundam World Sangoku Soketsuden"},
    {id: "Gundam Build Divers Re:Rise", name: "Gundam Build Divers Re:Rise"},
    {id: "SD Gundam World Heroes", name: "SD Gundam World Heroes"},
    {id: "Mobile Suit Gundam: The Witch from Mercury", name: "Mobile Suit Gundam: The Witch from Mercury"},
    {id: "Mobile Suit Gundam GQuuuuuuX", name: "Mobile Suit Gundam GQuuuuuuX"},
    {id: "Mobile Suit Gundam (Compilation Movies)", name: "Mobile Suit Gundam (Compilation Movies)"},
    {id: "Mobile Suit Gundam: Char's Counterattack", name: "Mobile Suit Gundam: Char's Counterattack"},
    {id: "Mobile Suit SD Gundam (Movies)", name: "Mobile Suit SD Gundam (Movies)"},
    {id: "Mobile Suit Gundam 0080: War in the Pocket", name: "Mobile Suit Gundam 0080: War in the Pocket"},
    {id: "Mobile Suit SD Gundam (OVA)", name: "Mobile Suit SD Gundam (OVA)"},
    {id: "Mobile Suit Gundam F91 (1991)", name: "Mobile Suit Gundam F91 (1991)"},
    {id: "Mobile Suit Gundam 0083: Stardust Memory (OVA)", name: "Mobile Suit Gundam 0083: Stardust Memory (OVA"},
    {id: "Mobile Suit Gundam 0083: Stardust Memory (Compilation Movie)", name: "Mobile Suit Gundam 0083: Stardust Memory (Compilation Movie)"},
    {id: "Gundam Wing: Endless Waltz (OVA/Movie)", name: "Gundam Wing: Endless Waltz (OVA/Movie)"},
    {id: "Turn A Gundam (Compilation Movies)", name: "Turn A Gundam (Compilation Movies)"},
    {id: "Mobile Suit Zeta Gundam: A New Translation (Compilation Movies)", name: "Mobile Suit Zeta Gundam: A New Translation (Compilation Movies)"},
    {id: "Mobile Suit Gundam 00 the Movie: A Wakening of the Trailblazer", name: "Mobile Suit Gundam 00 the Movie: A Wakening of the Trailblazer"},
    {id: "SD Gundam Sangokuden Brave Battle Warriors (Movie)", name: "SD Gundam Sangokuden Brave Battle Warriors (Movie)"},
    {id: "Mobile Suit Gundam Unicorn (OVA)", name: "Mobile Suit Gundam Unicorn (OVA)"},
    {id: "Gundam Reconguista in G (Compilation Movies)", name: "Gundam Reconguista in G (Compilation Movies)"},
    {id: "Mobile Suit Gundam Narrative", name: "Mobile Suit Gundam Narrative"},
    {id: "Mobile Suit Gundam Hathaway", name: "Mobile Suit Gundam Hathaway"},
    {id: "Mobile Suit Gundam: Cucuruz Doan's Island", name: "Mobile Suit Gundam: Cucuruz Doan's Island"},
    {id: "Mobile Suit Gundam SEED Freedom", name: "Mobile Suit Gundam SEED Freedom"},
    {id: "Mobile Suit Gundam AGE: Memory of Eden", name: "Mobile Suit Gundam AGE: Memory of Eden"},
    {id: "Gundam Evolve (OVA)", name: "Gundam Evolve (OVA)"},
    {id: "G-Saviour (Live-Action TV Movie)", name: "G-Saviour (Live-Action TV Movie)"},
    {id: "Gundam Breaker Battlogue (ONA)", name: "Gundam Breaker Battlogue (ONA)"},
    {id: "Mobile Suit Gundam: Silver Phantom (VR Movie)", name: "Mobile Suit Gundam: Silver Phantom (VR Movie)"},
    {id: "Mobile Suit Gundam Iron-Blooded Orphans: Urðr-Hunt (ONA)", name: "Mobile Suit Gundam Iron-Blooded Orphans: Urðr-Hunt (ONA)"},
    {id: "Gundam Build Metaverse (ONA)", name: "Gundam Build Metaverse (ONA)"},
  ]


  // Danh sách phân khúc Gundam
  const scaleOptions = ["1/144", "1/100", "1/60", "1/48"];
//   const conditionOptions = {
//     new: "Hộp mới nguyên dạng, chưa bóc seal, linh kiện không bị hư hại, đủ phụ kiện đi kèm",
//     "open box": "Đã mở hộp, có thể đã thiếu phụ kiện hoặc có vết trầy xước nhẹ",
//     "used": "Sản phẩm đã qua sử dụng, có dấu hiệu hao mòn hoặc đã được lắp ráp",
//   };
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
//  Xử lý thêm dòng nhập phụ kiện
const handleAddAccessory = () => {
    setAccessories([...accessories, { name: "", quantity: 1 }]);
  };
  
  // Xóa dòng phụ kiện
  const handleRemoveAccessory = (index) => {
    setAccessories(accessories.filter((_, i) => i !== index));
  };
  
  //  Cập nhật giá trị nhập vào
  const handleAccessoryChange = (index, field, value) => {
    const newAccessories = [...accessories];
    newAccessories[index][field] = value;
    setAccessories(newAccessories);
  };


const handleFinish = (values) => {
    setIsUploading(true); 
    const hideLoading = message.loading("Đang xử lý...", 0);
    const formData = new FormData();
    console.log(values);
    formData.append("name", values.name);
    formData.append("grade_id", values.grade_id);
    formData.append("series", values.series);
    formData.append("condition", values.condition);
    formData.append("manufacturer", values.manufacturer);
    formData.append("scale", values.scale);
    formData.append("weight", values.weight);
    formData.append("description", values.description);
    formData.append("price", values.price);
    if (values.condition_description !== "" && values.condition_description !== undefined)
    formData.append("condition_description", values.condition_description);
    
    console.log("1st img",primaryImage);
    console.log("2nd img",secondaryImages);
    //  Thêm ảnh chính (primary_image)
    formData.append("primary_image", primaryImage.file);
      console.log("qua bước này")
    secondaryImages.forEach((file) => {
        console.log(file);
        formData.append("secondary_images", file.originFileObj);
    })
    const validAccessories = accessories.filter(
        (item) => item.name.trim() !== "" && item.quantity > 0
      );
      validAccessories.forEach((item) => {
        const accessoryData = JSON.stringify({ name: item.name, quantity: item.quantity });
        formData.append("accessory", accessoryData);
      });
    // Thêm ảnh phụ (secondary_images[])
    // images
    //   .filter((img) => img.url !== primaryImage)
    //   .forEach((img) => {
    //     formData.append(`secondary_images`, img.file);
    //   });
    //   console.log(formData);
    PostGundam(user.id, formData)
    .then((response) => {
      hideLoading();
      if (response.status === 200) {
        message.success("Sản phẩm đã được đăng ký thành công!");
        form.resetFields();
        setPrimaryImage(null);
        setTimeout(setIsCreating(false),800);
        // setIsCreating(false);
      }
    })
    .catch(() => {
      hideLoading();
      message.error("Lỗi khi đăng ký sản phẩm! Vui lòng thử lại.");
    })
    .finally(() => {
        setIsUploading(false); // Tắt trạng thái loading
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
    <div className="bg-white p-6 rounded-lg shadow-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Thêm Sản Phẩm Gundam Mới</h2>

      <Form form={form} layout="vertical" onFinish={handleFinish} className="grid grid-cols-12 gap-x-4">
        <Form.Item
          name="name"
          label="Tên Gundam"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          className="col-span-12"
        >
          <Input placeholder="VD: MGEX 1/100 Strike Freedom Gundam" />
        </Form.Item>
        <Form.Item
          name="series"
          label="Thuộc dòng phim hoặc series"
          rules={[{ required: true, message: "Vui lòng nhập tên series!" }]}
          className="col-span-12"
        >
          <Select placeholder="Chọn phim hoặc series">
            {series.map((seri) => (
              <Option key={seri.id} value={seri.id}>
                {seri.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="grade_id"
          label="Phân khúc"
          rules={[{ required: true, message: "Vui lòng chọn phân khúc!" }]}
          className="col-span-6"
        >
          <Select placeholder="Chọn phân khúc">
            {grades.map((grade) => (
              <Option key={grade.id} value={grade.id}>
                {grade.display_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="scale"
          label="Kích thước"
          rules={[{ required: true, message: "Vui lòng chọn tỷ lệ sản phẩm!" }]}
          className="col-span-6"
        >
          <Select placeholder="Chọn kích thước">
            {scaleOptions.map((scale) => (
              <Option key={scale} value={scale}>
                {scale}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="condition"
          label="Tình trạng sản phẩm"
          rules={[{ required: true }]}
          tooltip={{
            title: 'Mô tả tình trạng sản phẩm trong tường hợp có va trạng hoặc trầy xước thì tình trạng sẽ là - "Đã mở hộp"',
            icon: <InfoCircleOutlined />,
          }}
          className="col-span-6"
        >
          <Select value={condition} onChange={setCondition}>
            <Option value="new">Hàng mới</Option>
            <Option value="open box">Đã mở hộp</Option>
            <Option value="used">Đã qua sử dụng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="manufacturer"
          label="Thương hiệu"
          rules={[{ required: true, message: "Vui lòng thêm thương hiệu" }]}
          className="col-span-6"
        >
          <Input placeholder="VD: Bandai, Kotobukiya..." />
        </Form.Item>

        {condition === 'new' && (
          <div className="col-span-12 mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            <p className="text-sm"><strong>Lưu ý:</strong> Tình trạng sản phẩm: Hộp mới nguyên dạng, chưa bóc seal, linh kiện không bị hư hại, đủ phụ kiện đi kèm.</p>
          </div>
        )}
        {condition === 'open box' && (
          <div className="col-span-12 mb-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            <p className="text-sm"><strong>Lưu ý:</strong> Tình trạng sản phẩm: mới mở seal ngoài và kiểm tra mảnh trong. Trong trường hợp mất vỏ nhưng chưa xé seal trong mảnh thì hãy để tình trạng sản phẩm là &quot;Đã qua sử dụng&quot;</p>
          </div>
        )}

        {(condition === 'open box' || condition === 'used') && (
          <Form.Item
            name="condition_description"
            label="Mô tả tình trạng"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả tình trạng sản phẩm' }]}
            className="col-span-12"
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả chi tiết tình trạng sản phẩm (trầy xước, móp vỏ , ect ...)" />
          </Form.Item>
        )}

        <Form.Item
          name="weight"
          label="Cân nặng"
          rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          tooltip={{
            title: 'Dùng để tính chi phí vận chuyển. (3.500 vnd / 500g)',
            icon: <InfoCircleOutlined />,
          }}
          className="col-span-6"
        >
          <InputNumber
            min={1}
            addonAfter="gram"
            style={{ width: "100%" }}
            parser={(value) => value.replace(/[^0-9]/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Giá bán"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
          className="col-span-6"
        >
          <InputNumber
            value={price}
            onChange={handlePriceChange}
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/[^0-9]/g, "")}
            addonAfter="VNĐ"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
          className="col-span-12"
        >
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết về sản phẩm, đặc điểm nổi bật..." />
        </Form.Item>

        <div className="col-span-12">
          <Form.Item label="Phụ kiện" className="mb-2">
            <div className="border p-4 rounded-md bg-gray-50">
              {accessories.length === 0 && (
                <div className="text-gray-500 text-sm mb-2">Chưa có phụ kiện nào được thêm</div>
              )}
              {accessories.map((accessory, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder="Tên phụ kiện"
                    value={accessory.name}
                    className="flex-grow"
                    onChange={(e) => handleAccessoryChange(index, "name", e.target.value)}
                  />
                  <InputNumber
                    min={1}
                    placeholder="SL"
                    value={accessory.quantity}
                    className="w-16"
                    onChange={(value) => handleAccessoryChange(index, "quantity", value)}
                  />
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveAccessory(index)}
                    size="small"
                  />
                </div>
              ))}
              <Button
                type="dashed"
                onClick={handleAddAccessory}
                icon={<PlusOutlined />}
                className="mt-2"
              >
                Thêm Phụ Kiện
              </Button>
            </div>
          </Form.Item>
        </div>

        <Form.Item label="Hình ảnh sản phẩm" className="col-span-12">
          <div className="border p-4 rounded-md">
            <ImageUpload
              primaryImage={primaryImage}
              setPrimaryImage={setPrimaryImage}
              secondaryImages={secondaryImages}
              setSecondaryImages={setSecondaryImages}
            />
          </div>
        </Form.Item>

        <div className="col-span-12 flex justify-end space-x-3 mt-4 pt-4 border-t">
          <Button
            onClick={() => setIsCreating(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700"
            icon={<UploadOutlined />}
            disabled={isUploading}
          >
            {isUploading ? "Đang tải dữ liệu..." : "Đăng ký sản phẩm"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

ShopProductCreate.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};

export default ShopProductCreate;
