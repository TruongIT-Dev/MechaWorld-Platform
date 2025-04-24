import ExchangeDetailInformationSection from "./ExchangeInfo/ExchangeInformationSection";
import ActionButtons from "./ExchangeDetails/ActionButtons";
import ProgressSection from "./ExchangeProcess/ProgressSection";
import ExchangeInformation from "./ExchangeInformation";
import ExchangeLoader from "./ExchangeLoader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserAddresses } from "../../apis/User/APIUser";

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

  // State quản lý trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);

  const [firstAddress, setFirstAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");

  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // The firstUser and secondUser variables are used to determine the users involved in the exchange process.
  // These variables are set based on the isRequestUser property of the exchangeData object, which indicates whether the current user is the request user or the post user.
  // Depending on the value of isRequestUser, the firstUser and secondUser variables are assigned the appropriate user objects from the exchangeData object.
  // This allows the component to display the correct information for each user in the exchange process.
  // The firstUser variable represents the user who is requesting the exchange, while the secondUser variable represents the user who is posting the exchange.
  // These variables are used to render the exchange information and action buttons for each user.
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

  // The firstGundamGroup and secondGundamGroup variables are used to determine the groups of users involved in the exchange process.
  // These variables are set based on the isRequestUser property of the exchangeData object, which indicates whether the current user is the request user or the post user.
  // Depending on the value of isRequestUser, the firstGundamGroup and secondGundamGroup variables are assigned the appropriate user lists from the exchangeData object.
  // This allows the component to display the correct information for each group of users in the exchange process.
  // The firstGundamGroup variable represents the group of users who are requesting the exchange, while the secondGundamGroup variable represents the group of users who are posting the exchange.
  // These variables are used to render the exchange information and action buttons for each group of users.

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
          firstUser:5, 
          secondUser: 5, 
        },

      };

      setExchangeData(fakeExchangeData);

      // Thiết lập tiến trình ban đầu dựa trên dữ liệu nhận được
      setFirstCurrentStage(fakeExchangeData.initialStage.firstUser);
      setSecondCurrentStage(fakeExchangeData.initialStage.secondUser);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu trao đổi:", error);
    }
  };

  // Hàm lấy địa chỉ người dùng từ API
  const fetchUserAddress = async () => {
    try {
      // Giả định gọi API và nhận danh sách địa chỉ
      const addresses = await getUserAddresses(currentUser.id).then((res) => res.data);
      // lọc địa chỉ có isPrimary = true
      const primaryAddress = addresses.filter((address) => address.is_primary === true);
      // console.log(addresses);
      setSelectedAddress(primaryAddress[0]);
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

    const fetchAddress = async () => {
      const response = await getUserAddresses(currentUser.id).then((res) => res.data);
      setAddress(response);
    }
    fetchAddress();
    // console.log("checking selectedAddress data", selectedAddress);
  }, []);



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
              firstGundamGroup={firstGundamGroup}
              secondGundamGroup={secondGundamGroup}
              exchangeData={exchangeData}
              address={address}
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
              selectedAddress={selectedAddress}
            />
            <ExchangeInformation
              firstCurrentStage={firstCurrentStage}
              secondCurrentStage={secondCurrentStage}
              exchangeData={exchangeData}
              firstUser={firstUser}
              secondUser={secondUser}
              firstGundamGroup={firstGundamGroup}
              secondGundamGroup={secondGundamGroup}
            />
          </div>

          {/* Bên phải */}
          <div className="basis-1/3 min-w-fit ">
            <ProgressSection 
            firstCurrentStage={firstCurrentStage} 
            exchangeData={exchangeData}
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
