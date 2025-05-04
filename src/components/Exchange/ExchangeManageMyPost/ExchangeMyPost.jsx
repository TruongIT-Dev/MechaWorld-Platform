import { useEffect, useState } from "react";
import { Layout, Card, Tabs, Typography } from "antd";
import { myPosts, offers } from "./Data";

import PostsTable from "./PostsTable";
import OffersDrawer from "./OffersDrawer";
import ListGundamModal from "./ListGundamModal";
import OfferDetailModal from "./OfferDetailModal";
import { getAllUserExchangePost } from "../../../apis/Exchange/APIExchange";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

export default function ExchangeMyPost() {
    const [activeTab, setActiveTab] = useState("1");
    const [selectedPost, setSelectedPost] = useState(null);
    const [offersDrawerVisible, setOffersDrawerVisible] = useState(false);
    const [offerDetailModalVisible, setOfferDetailModalVisible] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [postOffers, setPostOffers] = useState([]);
    const [gunplasModalVisible, setGunplasModalVisible] = useState(false);
    const [userPost,setUserPost] = useState([]);

    // View post offers
    const viewOffers = (post) => {
        setPostOffers(post.offers);
        // setSelectedPost(post);
        console.log(post.offers);
        setOffersDrawerVisible(true);
    };

    // View gunplas in the post
    const viewGunplas = (post) => {
        setSelectedPost(post);
        // setGunplasModalVisible(true);
        console.log(post);
    };

    // View offer details
    const viewOfferDetail = (offer) => {
        setSelectedOffer(offer);
        setOfferDetailModalVisible(true);
        console.log(offer);
    };

    // Handle offer actions (accept/reject)
    const handleOfferAction = (offerId, action) => {
        console.log(`Offer ${offerId} ${action}`);
        // In a real app, you would update the offer status in your database
    };

    // Delete post
    const handleDeletePost = (postId) => {
        console.log(`Post ${postId} deleted`);
        // In a real app, you would delete the post from your database
    };
    useEffect(()=> {
        getAllUserExchangePost().then((res) => {
            setUserPost(res.data);
        })
    },[])

    return (
        <Layout className="min-h-screen bg-gray-100 mt-5">
            <Content className="max-w-7xl mx-auto mt-24 px-4 py-6">
                <Card className="shadow-md">
                    <Title level={3} className="text-center mb-6">Quản Lý Bài Viết Trao Đổi Gundam</Title>

                    <Tabs centered activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
                        <TabPane tab="Bài viết của tôi" key="1">
                            <PostsTable
                                posts={myPosts}
                                userPost={userPost}
                                onViewOffers={viewOffers}
                                onViewGunplas={viewGunplas}
                                onDeletePost={handleDeletePost}
                            />
                        </TabPane>
                    </Tabs>
                </Card>

                {/* Modals & Drawers */}
                <ListGundamModal
                    visible={gunplasModalVisible}
                    post={selectedPost}
                    onClose={() => setGunplasModalVisible(false)}
                />

                <OffersDrawer
                    visible={offersDrawerVisible}
                    post={selectedPost}
                    offers={postOffers}
                    onClose={() => setOffersDrawerVisible(false)}
                    onViewOfferDetail={viewOfferDetail}
                />

                <OfferDetailModal
                    visible={offerDetailModalVisible}
                    offer={selectedOffer}
                    post={selectedPost}
                    onClose={() => setOfferDetailModalVisible(false)}
                    onAction={handleOfferAction}
                />
            </Content>
        </Layout>
    );
}