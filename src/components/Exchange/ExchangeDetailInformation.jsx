import ExchangeDetailInformationSection from "./ExchangeInfo/ExchangeInformationSection";
import ActionButtons from "./ExchangeDetails/ActionButtons";
import ProgressSection from "./ExchangeProcess/ProgressSection";
import ExchangeInformation from "./ExchangeInformation";
import ExchangeLoader from "./ExchangeLoader";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses } from "../../apis/User/APIUser";
import { getExchangeDetail } from "../../apis/Exchange/APIExchange";
import { useParams } from "react-router-dom";
// import { updateDeliveryFee, updateExchangeData } from "../../features/exchange/exchangeSlice";
// import { checkDeliveryFee } from "../../apis/GHN/APIGHN";
import { selectDeliveryFee, hasDeliveryFee } from "../../utils/exchangeUtils";
const ExchangeDetailInformation = () => {
  // This component is responsible for displaying the exchange detail information, including the exchange information section, action buttons, and progress section.
  // It uses the ExchangeInformationSection, ActionButtons, and ProgressSection components to render the respective sections.
  // The layout is divided into two main sections: the left section (2/3 of the width) contains the exchange information and action buttons, while the right section (1/3 of the width) contains the progress section.
  // The left section is further divided into a flex column layout with a gap between the sections.
  // The right section is a minimum width fit to accommodate the progress section.
  // The overall layout is responsive and adjusts based on the screen size.
  // The component is exported as the default export of the module.
  const currentUser = useSelector((state) => state.auth.user);

  const [firstCurrentStage, setFirstCurrentStage] = useState(-1);
  const [secondCurrentStage, setSecondCurrentStage] = useState(-1);

  // State lưu trữ dữ liệu trao đổi và địa chỉ người dùng
  const [exchangeData, setExchangeData] = useState([]);
  const [exchangeDetail, setExchangeDetail] = useState(null);
  // State quản lý trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [firstAddress, setFirstAddress] = useState(null);
  const [secondAddress, setSecondAddress] = useState(null);
  const [currentUser2, setFirstUser] = useState();
  const [partner, setSecondUser] = useState();
  const [deliverData, setDeliverData] = useState(null);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState(null);
  const ExchangeId = () => {
    const { id } = useParams();
    return id;
  };

  const exchangeId = ExchangeId();

 
  const firstUser = exchangeData?.exchange
    ? exchangeData.isRequestUser
      ? exchangeData.exchange.requestUser
      : exchangeData.exchange.post?.user
    : null;

  const secondUser = exchangeData?.exchange
    ? exchangeData.isRequestUser
      ? exchangeData.exchange.post?.user
      : exchangeData.exchange.requestUser
    : null;



  const firstGundamGroup = exchangeData
    ? exchangeData.isRequestUser
      ? exchangeData.requestUserList
      : exchangeData.postUserList
    : null;

  const secondGundamGroup = exchangeData
    ? exchangeData.isRequestUser
      ? exchangeData.postUserList
      : exchangeData.requestUserList
    : null;

  // Hàm xử lý khi một bên hoàn tất một bước
  // const handleNextStep = () => {
  //   if (firstCurrentStage < 5) {
  //     setFirstCurrentStage(firstCurrentStage + 1);
  //     setSecondCurrentStage(secondCurrentStage + 1);
  //   }
  // };

  // Hàm xử lý khi một bên từ chối bước hiện tại
  // const handleRejectStep = () => {
  //   alert("Giao dịch đã bị từ chối.");
  //   setFirstCurrentStage(0);
  //   setSecondCurrentStage(0);
  // };
  const fee = useSelector((state) =>
    selectDeliveryFee(state, currentUser.id, exchangeDetail?.id)
  );
  
  const isFeeAvailable = useSelector((state) =>
    hasDeliveryFee(state, exchangeDetail?.current_user.id, exchangeDetail?.id)
  );
  const isPartnerFeeAvailable = useSelector((state) =>
    hasDeliveryFee(state, exchangeDetail?.partner.id, exchangeDetail?.id)
  );
  // console.log('partner id: ',exchangeDetail?.partner.id);
  // console.log('your id: ',exchangeDetail?.current_user.id);
  // console.log('partner check: ',isPartnerFeeAvailable);
  // console.log('your check: ',isFeeAvailable);

  // const cacheDeliveryFee = (userId, exchangeId, fee) => {
  //   const key = `${userId}_${exchangeId}`;
  //   localStorage.setItem(key, JSON.stringify(fee));
  // };
  
  // const getCachedDeliveryFee = (userId, exchangeId) => {
  //   const key = `${userId}_${exchangeId}`;
  //   const raw = localStorage.getItem(key);
  //   return raw ? JSON.parse(raw) : null;
  // };
  


  const fetchExchangeData = async () => {
    try {
      // Giả định gọi API và nhận dữ liệu
      // const data = await fetch("/api/exchange").then((res) => res.json());
      // Fake data for testing
      const fakeExchangeData = {
        
        exchange: {
          id: 2213,
          createdAt: "2025-04-06T21:47:38.099Z",
          updatedAt: "2025-04-06T21:55:26.000Z",
          deletedAt: null,
          requestUser: {
            id: "6575e8bb-bafb-4e40-98a0-01435adb3d4f",
            full_name: "Huy FTB",
            email: "thehuygaming@gmail.com",
            avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocLqAdPb9eHUuCKlFV7iyCRTWqPeMOoBV1f-Oa0x8Y_0-YZoqBXi=s96-c",
            balance: 519000,
            phone_number: "0961841902",
          },
          post: {
            id: "c6c0a499-e64a-4ae0-bd24-41f18650364c",
            postContent: "Cần trao đổi Gundam HG Barbatos với MG Strike Freedom",
            images: [
              "https://firebasestorage.googleapis.com/v0/b/comzone-69b8f.appspot.com/o/images%2F1734627916841?alt=media&token=fa745a42-9ce9-400b-b496-d9c1afada209"
            ],
            status: "UNAVAILABLE",
            user: {
              id: "a9d4c545-15eb-4d51-b091-49414e6ee84a",
              full_name: "Hypermoon",
              avatar_url: "https://lh3.googleusercontent.com/a/ACg8ocICorMWOnDNyalaiOHP3J3lMtdvphY_2zNjYzrQplyNB2gcgNI3=s96-c",
              email: "manhhuyftb@gmail.com",
              balance: 578000,
              phone_number: "0961841906",
            }
          },
          depositAmount: 100000, // Số tiền cọc
          compensationAmount: 60000, // Số tiền bù trừ
          status: "DEALING", // Trạng thái giao dịch 
          compensateUser: {
            id: "6575e8bb-bafb-4e40-98a0-01435adb3d4f",
            full_name: "Huy FTB",
            email: "thehuygaming@gmail.com",
            avatar: "https://lh3.googleusercontent.com/a/ACg8ocLqAdPb9eHUuCKlFV7iyCRTWqPeMOoBV1f-Oa0x8Y_0-YZoqBXi=s96-c",
          },
        },
        isRequestUser: true, // Xác định người dùng hiện tại là requestUser
        requestUserList: [
          {
            id: 1,
            full_name: "Huy FTB",
            gundams: [
              {
                id: 201,
                name: "RX-78-2 Gundam",
                grade: "Master Grade",
                scale: "1/100",
                condition: "New",
                manufacturer: "Bandai",
              },
              {
                id: 202,
                name: "Zaku II",
                grade: "High Grade",
                scale: "1/144",
                condition: "Used",
                manufacturer: "Bandai",
              },
            ],
          },
        ],
        postUserList: [
          {
            id: 2,
            name: "Hypermoon",
            gundams: [
              {
                id: 204,
                name: "GM-100 Gundam",
                grade: "High Grade",
                scale: "1/144",
                condition: "Mint",
                manufacturer: "Bandai",
              },
              {
                id: 205,
                name: "Wing Gundam Zero",
                grade: "Perfect Grade",
                scale: "1/60",
                condition: "New",
                manufacturer: "Bandai",
              },
            ],
          },         
        ],
        initialStage: {
          firstUser: 2, 
          secondUser: 2, 
        },

      };

      setExchangeData(fakeExchangeData);

      getExchangeDetail(exchangeId).then((res) => {
        setExchangeDetail(res.data);
        setFirstUser(res.data.current_user);
        setSecondUser(res.data.partner);
        // const yourDeData = getCachedDeliveryFee(res.data.current_user.id, res.data.id)
        // const partnerDeData = getCachedDeliveryFee(res.data.partner.id, res.data.id)
        
        // console.log(res.data.current_user);
        // console.log(res.data.partner);
        // console.log(res.data);


        //  console.log(yourDeData);
          // console.log(partnerDeData);



        switch (res.data.status) {
          case "pending":
            if (res.data.current_user.from_address === null) {
              setFirstCurrentStage(1); // Nếu from_address là null
            } else if (res.data.current_user.delivery_fee !== null) {
              if (res.data.current_user.delivery_fee_paid == true) {
                setFirstCurrentStage(4); // Nếu delivery_fee_paid = true
              } else {
                setFirstCurrentStage(3); // Nếu có delivery_fee nhưng chưa thanh toán
              }
            } else if (isFeeAvailable === true) {
              setFirstCurrentStage(3); // Nếu isFeeAvailable là true
            } else {
              console.log("qua bước này rồi nhé");
              setFirstCurrentStage(2); // Nếu có from_address nhưng không có delivery_fee
            }
  
            if (res.data.partner.from_address === null) {
              setSecondCurrentStage(1); 
            } else if (res.data.partner.delivery_fee !== null) {
              if (res.data.partner.delivery_fee_paid == true) {
                setSecondCurrentStage(4); 
              } else {
                setSecondCurrentStage(3); 
              }
            } else if (isPartnerFeeAvailable === true) {
              setSecondCurrentStage(3); 
            } else  {
              setSecondCurrentStage(2)
            }
            break;
  
          case "packaging":
          case "delivering":
          case "delivered":
            setFirstCurrentStage(4); // Nếu đang đóng gói, giao hàng hoặc đã giao hàng
            setSecondCurrentStage(4); 
            break;
  
          case "completed":
            setFirstCurrentStage(5); // Nếu giao dịch đã hoàn tất
            setSecondCurrentStage(5); 
            break;
  
          default:
            setFirstCurrentStage(0); // Mặc định nếu không khớp trạng thái nào
            setSecondCurrentStage(0); 
            break;
        }
      })

      // console.log(firstCurrentStage);
      // console.log(secondCurrentStage);
      // Thiết lập tiến trình ban đầu dựa trên dữ liệu nhận được
      // setFirstCurrentStage(fakeExchangeData.initialStage.firstUser);
      // setSecondCurrentStage(fakeExchangeData.initialStage.secondUser);



    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu trao đổi:", error);
    }
  };

  // Hàm lấy địa chỉ người dùng từ API
  const fetchUserAddress = async () => {
    try {
      const addresses = await getUserAddresses(currentUser.id).then((res) => res.data);

      const pickupAddress = addresses.filter((address) => address.is_pickup_address === true);
      // console.log("pickupAddress" ,pickupAddress);
      const primaryAddress = addresses.filter((address) => address.is_primary === true);
      
      // console.log(addresses);
      setSelectedAddress(primaryAddress[0]);
      setSelectedPickupAddress(pickupAddress[0]);
      setAddress(addresses);
      // console.log(selectedPickupAddress);
      // console.log("checking data",selectedAddress);
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ người dùng:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchExchangeData(), fetchUserAddress()]);
      setIsLoading(false);
    };
    fetchData();

    // const fetchAddress = async () => {
    //   const response = await getUserAddresses(currentUser.id).then((res) => res.data);
    //   setAddress(response);
    // }
    // fetchAddress();
    // console.log("checking selectedAddress data", selectedAddress);
  }, [firstCurrentStage, secondCurrentStage]);



  return (
    <div className="flex mt-32">
      {firstCurrentStage > -1 ? (
        <>
          {/* Bên trái */}
          <div className="basis-2/3 flex flex-col items-stretch justify-start gap-4 px-4 border-r border-gray-300">
          <ExchangeDetailInformationSection
              firstCurrentStage={firstCurrentStage}
              setFirstCurrentStage={setFirstCurrentStage}
              secondCurrentStage={secondCurrentStage}
              setSecondCurrentStage={setSecondCurrentStage}
              firstUser={firstUser}
              secondUser={secondUser}
              currentUser={currentUser2}
              partner={partner}
              deliverData={deliverData}
              setDeliverData={setDeliverData}
              exchangeDetail={exchangeDetail}
              firstGundamGroup={firstGundamGroup}
              secondGundamGroup={secondGundamGroup}
              exchangeData={exchangeData}
              address={address}
              selectedPickupAddress={selectedPickupAddress}
              setSelectedPickupAddress={setSelectedPickupAddress}
              setAddress={setAddress}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              firstAddress={firstAddress}
              secondAddress={secondAddress}
              setIsLoading={setIsLoading}
            />
            <ActionButtons
              currentStage={firstCurrentStage}
              setFirstCurrentStage={setFirstCurrentStage}
              oppositeCurrentStage={secondCurrentStage}
              setSecondCurrentStage={setSecondCurrentStage}
              exchangeData={exchangeData}
              deliverData={deliverData}
              setDeliverData={setDeliverData}
              exchangeDetail={exchangeDetail}
              selectedAddress={selectedAddress}
              selectedPickupAddress={selectedPickupAddress}
            />
            <ExchangeInformation
              firstCurrentStage={firstCurrentStage}
              secondCurrentStage={secondCurrentStage}
              exchangeData={exchangeData}
              firstUser={currentUser2}
              secondUser={partner}
              exchangeDetail={exchangeDetail}
              firstGundamGroup={firstGundamGroup}
              secondGundamGroup={secondGundamGroup}
            />
          </div>

          {/* Bên phải */}
          <div className="basis-1/3 min-w-fit ">
            <ProgressSection 
            firstCurrentStage={firstCurrentStage} 
            secondCurrentStage={secondCurrentStage} 
            exchangeData={exchangeData}
            exchangeDetail={exchangeDetail}
            />
          </div>
        </>
      ) : (
        <div>
          <ExchangeLoader />
        </div>
      )}
    </div>
  );
};

export default ExchangeDetailInformation;
