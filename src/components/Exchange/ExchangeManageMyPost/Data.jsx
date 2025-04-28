export const myPosts = [
    {
        id: "1",
        content: "Mình đang cần trao đổi những mô hình Gundam này. Ưu tiên các loại MG hoặc PG, có thể thương lượng về giá. Mình sẵn sàng trao đổi nhiều mô hình cùng lúc.",
        image: "/post-image-1.png",
        createdAt: "15/04/2025",
        gunplas: [
            {
                id: "g1",
                title: "RX-78-2 Gundam",
                category: "HG 1/144",
                series: "Mobile Suit Gundam",
                condition: "90%",
                image: "/gundam1.png",
            },
            {
                id: "g2",
                title: "Zaku II",
                category: "HG 1/144",
                series: "Mobile Suit Gundam",
                condition: "85%",
                image: "/zaku2.png",
            }
        ],
        views: 245,
        interested: 12,
        status: "active",
        offers: 5
    },
    {
        id: "2",
        content: "Muốn trao đổi Barbatos với các loại Gundam thuộc series SEED hoặc 00. Mô hình đã lắp ráp và sơn kỹ, có thể cộng thêm tiền nếu cần thiết.",
        image: "/post-image-2.png",
        createdAt: "10/04/2025",
        gunplas: [
            {
                id: "g3",
                title: "Gundam Barbatos Lupus Rex",
                category: "FM 1/100",
                series: "Iron-Blooded Orphans",
                condition: "100%",
                image: "/gundam2.png",
            }
        ],
        views: 178,
        interested: 8,
        status: "active",
        offers: 3
    },
    {
        id: "3",
        content: "Tìm người trao đổi một số mô hình thuộc Gundam SEED. Mình đặc biệt quan tâm đến các mô hình thuộc series UC như Unicorn, Sinanju.",
        image: "/post-image-3.png",
        createdAt: "05/04/2025",
        gunplas: [
            {
                id: "g4",
                title: "Strike Freedom Gundam",
                category: "MG 1/100",
                series: "Gundam SEED Destiny",
                condition: "95%",
                image: "/gundam3.png",
            },
            {
                id: "g5",
                title: "Justice Gundam",
                category: "MG 1/100",
                series: "Gundam SEED Destiny",
                condition: "90%",
                image: "/justice.png",
            },
            {
                id: "g6",
                title: "Destiny Gundam",
                category: "RG 1/144",
                series: "Gundam SEED Destiny",
                condition: "95%",
                image: "/destiny.png",
            }
        ],
        views: 320,
        interested: 15,
        status: "active",
        offers: 7
    },
    {
        id: "4",
        content: "Cần trao đổi Unicorn Gundam. Mô hình đã lắp ráp, dán decal và lắp bộ LED đầy đủ. Chỉ trao đổi với mô hình cùng đẳng cấp.",
        image: "/post-image-4.png",
        createdAt: "01/04/2025",
        gunplas: [
            {
                id: "g7",
                title: "Unicorn Gundam (Destroy Mode)",
                category: "RG 1/144",
                series: "Gundam Unicorn",
                condition: "85%",
                image: "/gundam4.png",
            }
        ],
        views: 156,
        interested: 6,
        status: "inactive",
        offers: 0
    }
];

// Mock data for exchange offers
export const offers = [
    {
        id: "101",
        postId: "1",
        user: "Minh",
        avatar: "/avatar-minh.png",
        offerModel: {
            title: "Wing Gundam Zero EW",
            subtitle: "MG 1/100",
            image: "/gundam5.png",
            condition: "90%"
        },
        paymentDirection: "you",
        paymentAmount: 250000,
        note: "Mình rất thích model của bạn, sẵn sàng đổi và bù thêm tiền nếu cần.",
        status: "pending",
        createdAt: "Hôm nay lúc 10:27"
    },
    {
        id: "102",
        postId: "1",
        user: "Toàn",
        avatar: "/avatar-toan.png",
        offerModel: {
            title: "Gundam Exia",
            subtitle: "RG 1/144",
            image: "/gundam6.png",
            condition: "95%"
        },
        paymentDirection: "them",
        paymentAmount: 150000,
        note: "Mình muốn trao đổi và mong bạn có thể bù thêm chút tiền vì model của mình còn khá mới.",
        status: "pending",
        createdAt: "Hôm qua lúc 15:38"
    },
    {
        id: "103",
        postId: "2",
        user: "Khoa",
        avatar: "/avatar-khoa.png",
        offerModel: {
            title: "Sinanju Stein",
            subtitle: "MG 1/100",
            image: "/gundam7.png",
            condition: "80%"
        },
        paymentDirection: "them",
        paymentAmount: 350000,
        note: "Mình thích Barbatos của bạn, sẵn sàng trao đổi và bù thêm tiền.",
        status: "accepted",
        createdAt: "14/04/2025 lúc 09:12"
    },
    {
        id: "104",
        postId: "2",
        user: "Dũng",
        avatar: "/avatar-dung.png",
        offerModel: {
            title: "Freedom Gundam",
            subtitle: "RG 1/144",
            image: "/gundam8.png",
            condition: "100%"
        },
        paymentDirection: "you",
        paymentAmount: 200000,
        note: "Mình có Freedom Gundam RG mới lắp xong, muốn đổi với Barbatos của bạn.",
        status: "rejected",
        createdAt: "13/04/2025 lúc 18:45"
    },
    {
        id: "105",
        postId: "3",
        user: "Nhật",
        avatar: "/avatar-nhat.png",
        offerModel: {
            title: "Sazabi",
            subtitle: "RG 1/144",
            image: "/gundam9.png",
            condition: "90%"
        },
        paymentDirection: "you",
        paymentAmount: 500000,
        note: "Strike Freedom đẹp quá, mình muốn trao đổi với Sazabi RG của mình.",
        status: "pending",
        createdAt: "12/04/2025 lúc 14:33"
    }
];