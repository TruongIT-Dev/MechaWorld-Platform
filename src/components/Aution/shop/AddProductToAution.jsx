
import { commonClassNameOfInput,
         
         Caption, 
         PrimaryButton, 
         Title } from "../Design";

const initialState = {
  title: "",
  description: "",
  price: "",
  height: "",
  lengthpic: "",
  width: "",
  mediumused: "",
  weigth: "",
  category: null,
};

const AddProductToAution = () => {
  return (
    <>
      <section className="bg-white shadow-s1 p-8 rounded-xl">
  <Title level={5} className="font-normal mb-5">
    Thêm sản phẩm đấu giá
  </Title>
  <hr className="my-5" />
  <form>
    <div className="w-full">
      <Caption className="mb-2">Tên GunDam *</Caption>
      <input
        type="text"
        name="title"
        className={`${commonClassNameOfInput}`}
        placeholder="Nhập tên GunDam"
        required
      />
    </div>
    <div className="flex items-center gap-5 my-4">
      <div className="w-1/2">
        <Caption className="mb-2">Giá Sàn (VNĐ) *</Caption>
        <input
          type="number"
          name="price"
          placeholder="Nhập giá sàn"
          className={`${commonClassNameOfInput}`}
          required
        />
      </div>
      <div className="w-1/2">
        <Caption className="mb-2">Cân nặng (gram) *</Caption>
        <input
          type="number"
          name="weight"
          placeholder="Nhập cân nặng"
          className={`${commonClassNameOfInput}`}
          required
        />
      </div>
    </div>
    <div className="flex items-center gap-5 my-4">
      <div className="w-1/2">
        <Caption className="mb-2">Thời gian bắt đầu *</Caption>
        <input
          type="datetime-local"
          name="startTime"
          className={`${commonClassNameOfInput}`}
          required
        />
      </div>
      <div className="w-1/2">
        <Caption className="mb-2">Thời gian kết thúc *</Caption>
        <input
          type="datetime-local"
          name="endTime"
          className={`${commonClassNameOfInput}`}
          required
        />
      </div>
    </div>
    <div>
      <Caption className="mb-2">Mô tả *</Caption>
      <textarea
        name="description"
        className={`${commonClassNameOfInput}`}
        cols="30"
        rows="5"
        placeholder="Nhập mô tả sản phẩm"
        required
      ></textarea>
    </div>
    <div>
      <Caption className="mb-2">Hình ảnh *</Caption>
      <input
        type="file"
        className={`${commonClassNameOfInput}`}
        name="image"
        accept="image/*"
        required
      />
    </div>
    <PrimaryButton type="submit" className="rounded-none my-5 bg-blue-400">
      Tạo phiên đấu giá
    </PrimaryButton>
  </form>
</section>
    </>
  );
};
export default AddProductToAution;