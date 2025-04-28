import { Table, Badge, Button, Tag, Space, Tooltip, Modal, Image } from "antd";
import {
    MessageOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    SwapLeftOutlined,
    SwapOutlined
} from "@ant-design/icons";

const { confirm } = Modal;

export default function PostsTable({ posts, onViewOffers, onViewGunplas, onDeletePost }) {
    const statusColors = {
        active: "green",
        inactive: "default",
        exchanged: "blue",
        pending: "orange"
    };

    // Delete post confirmation
    const showDeleteConfirm = (postId) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa bài viết này?',
            icon: <ExclamationCircleOutlined />,
            content: 'Bài viết sẽ bị xóa vĩnh viễn và không thể khôi phục.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                onDeletePost(postId);
            }
        });
    };

    // Columns for posts table
    const columns = [
        {
            title: "Ảnh",
            dataIndex: "gunplas",
            key: "image",
            width: 120,
            align: 'center',
            render: (gunplas) => (
                <div className="flex justify-center">
                    <Image
                        src={gunplas[0]?.image || "/placeholder.png"}
                        alt="Gundam image"
                        width={80}
                        height={80}
                        className="object-cover"
                        preview={false}
                    />
                </div>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            align: 'center',
            render: (content) => (
                <span>
                    {content}
                </span>
            ),
        },
        {
            title: "Đề xuất",
            key: "offers",
            dataIndex: "offers",
            width: 130,
            align: 'center',
            render: (offers) => (
                <div className="flex items-center justify-center">
                    <Badge count={offers} showZero offset={[10, 0]}>
                        <SwapOutlined className="text-base" />
                    </Badge>
                </div>
            ),
        },
        {
            title: "Ngày đăng",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            align: 'center',
        },
        {
            title: "Gundam trao đổi",
            dataIndex: "gunplas",
            key: "gunplasCount",
            width: 140,
            align: 'center',
            render: (gunplas, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => onViewGunplas(record)}
                >
                    {gunplas.length} mô hình
                </Button>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: 'center',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status === "active" ? "Đang trao đổi" :
                        status === "inactive" ? "Tạm ngừng" :
                            status === "exchanged" ? "Đã trao đổi" : "Đang xử lý"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<MessageOutlined />}
                        type="primary"
                        onClick={() => onViewOffers(record)}
                        disabled={record.offers === 0}
                        className="bg-blue-500"
                    >
                        Xem đề xuất
                    </Button>
                    <Tooltip title="Chỉnh sửa">
                        <Button icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirm(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="overflow-x-auto">
            <Table
                columns={columns}
                dataSource={posts}
                rowKey="id"
                pagination={{ pageSize: 3 }}
                bordered
                className="gundam-table"
                rowClassName={(record, index) => index % 2 === 0 ? 'bg-gray-50' : ''}
            />
        </div>
    );
}