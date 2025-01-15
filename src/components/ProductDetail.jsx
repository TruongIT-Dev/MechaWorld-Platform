import { Col, Row, Image, Card, Breadcrumb, Avatar, List, Flex, Rate, Button, Typography, Space } from 'antd';
import { FieldTimeOutlined, BookOutlined, ProfileOutlined } from '@ant-design/icons';

// Import Image Banner
// import TutorDetailSlider from '../../components/tutor-detail/slider';
// import trailer from '../../assets/img/tutor-detail/Trailer.png';
// import tutorAvatar from '../../assets//img/tutor-detail/tutor-avatar.png';
import { UserOutlined, CheckCircleOutlined, ArrowRightOutlined, LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import React from 'react';
// import StudentRating from './student-rating';


// Style CSS
const TutorHeaderStyle = {
    color: 'black',
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '1.5',
    marginBottom: '1rem',
    textAlign: 'left',
    textTransform: 'capitalize',
}

const SubjectSubHeaderStyle = {
    color: 'black',
    fontSize: '24px',
    lineHeight: '1.5',
    marginBottom: '1rem',
    textAlign: 'left',
    textTransform: 'capitalize',
}

const ServiceScriptStyle = {
    textAlign: 'justify',
    fontSize: '17.6px',
    wordWrap: 'break-word',
    color: '404a64',
}

const SubContentSpacing = {
    margin: '5rem 0',
}

const HeaderSpacing = {
    marginBottom: '1rem',
    borderBottom: '1px solid #E9EAF0',
}

// Rating
// const desc = ['1.0', '2.0', '3.0', '4.0', '5.0'];


// List Icon Giảng viên Sub-5
const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

// Data Giảng viên Info
const data = Array.from({
    length: 1,
}).map((_, i) => ({
    href: 'https://ant.design',
    title: "Bach Khoa Ha Noi",
    content:
        'Tôi tin rằng với kinh nghiệm và phương pháp giảng dạy của mình, tôi có thể giúp học viên hoàn thành tốt khóa học Phụ đạo Server-Side development with NodeJS, Express, and MongoDB và đạt được mục tiêu học tập của mình...',
}));



// Main
const TutorDetail = () => {

    // ***********************************************************************
    //                                Variables


    //************************************************************************

    // ***********************************************************************
    //                                useState
    // UseState
    //************************************************************************


    // ***********************************************************************
    //                                useEffect


    //************************************************************************


    // ***********************************************************************
    //                                API Function

    //************************************************************************

    return (
        <>
            <div className='content' style={{ margin: '2rem 5rem' }}>
                <div className='bread-crumb'>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: 'Trang chủ',
                            },
                            {
                                title: 'Danh sách lớp học',
                            },
                            {
                                title: 'sdn301m',
                            },
                        ]}
                    />
                </div>
                <div className='mt-4'>
                    <Row>
                        <Col span={16}>
                            {/* Tên Khóa học */}
                            <div className='header text-start'>
                                <h1 style={TutorHeaderStyle}>hướng dẫn làm Assingment môn</h1>
                                <p>Xin chào! Tôi sẽ hướng dẫn cho bạn đạt điểm tuyệt đối trong assignment này.</p>
                            </div>

                            {/* Thông tin khóa học */}
                            <div className='subject-info text-start'>
                                {/* Header khóa học */}
                                <div className='subject-header'>
                                    <Row>
                                        {/* Tutor Info & Avatar */}
                                        <Col span={12}>
                                            <List
                                                itemLayout="horizontal"
                                            >
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size="large" icon={<UserOutlined />} />}
                                                        title="Giảng viên"
                                                        description="Heelo"
                                                    />
                                                </List.Item>
                                            </List>
                                        </Col>

                                        {/* Feedback & Rating */}
                                        {/* <Col span={12}>
                                            <Flex gap="middle" >
                                                <Rate tooltips={desc} onChange={} value={} />
                                                {value ? <span>{desc[value - 1]}</span> : null} <span style={{ color: 'grey' }}>(98 đánh giá)</span>
                                            </Flex>
                                        </Col> */}
                                    </Row>
                                </div>

                                {/* Nội dung khóa học */}
                                <div className='subject-video'>
                                    <Image
                                        src=""
                                    />
                                </div>
                            </div>

                            {/* Mô tả khóa học */}
                            <div className='subject-description' style={{ marginTop: '3rem' }}>
                                {/* Sub 1 */}
                                <div className='sub-1 text-start mb-3' style={SubContentSpacing}>
                                    <h1 style={SubjectSubHeaderStyle}>
                                        Mục tiêu
                                    </h1>
                                    <p style={ServiceScriptStyle}>
                                        {/* <b style={OpenServiceScriptStyle}>Dịch vụ</b> */}
                                        Khóa học này dành cho học viên đang theo học môn Server-Side development with NodeJS, Express, and MongoDB và cần hỗ trợ thêm để hoàn thành các bài tập (assignment).
                                    </p>
                                </div>

                                {/* Sub 2 */}
                                <div className='sub-2' style={SubContentSpacing}>
                                    <div className='sub-2-content text-start p-5' style={{ backgroundColor: '#E1F7E3' }}>
                                        <h1 style={SubjectSubHeaderStyle}> Bạn sẽ nhận được gì </h1>
                                        <div>
                                            <Row>
                                                <Col span={12}>
                                                    <List
                                                        itemLayout="horizontal"
                                                        dataSource={data}
                                                        style={{ textAlign: 'start' }}
                                                    >
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar style={{ backgroundColor: '#23BD33' }} size="small" icon={<CheckCircleOutlined />} />}
                                                                title='Hỗ trợ giải đáp và thắc mắc'
                                                                description="Giảng viên sẽ giải đáp chi tiết các thắc mắc của học viên liên quan đến nội dung môn học, bao gồm lý thuyết và bài tập."
                                                            />
                                                        </List.Item>

                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar style={{ backgroundColor: '#23BD33' }} size="small" icon={<CheckCircleOutlined />} />}
                                                                title='Luyện tập thực hành'
                                                                description="Học viên sẽ có cơ hội thực hành giải các bài tập mẫu và bài tập thực tế dưới sự hướng dẫn của giảng viên."
                                                            />
                                                        </List.Item>
                                                    </List>
                                                </Col>

                                                <Col span={12}>
                                                    <List
                                                        itemLayout="horizontal"
                                                        dataSource={data}
                                                    >
                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar style={{ backgroundColor: '#23BD33' }} size="small" icon={<CheckCircleOutlined />} />}
                                                                title='Hướng dẫn giải assignment'
                                                                description="Giảng viên sẽ hướng dẫn học viên cách tiếp cận và giải quyết các bài tập trong môn học, bao gồm phân tích đề bài, lựa chọn công cụ phù hợp, và viết mã code."
                                                            />
                                                        </List.Item>

                                                        <List.Item>
                                                            <List.Item.Meta
                                                                avatar={<Avatar style={{ backgroundColor: '#23BD33' }} size="small" icon={<CheckCircleOutlined />} />}
                                                                title='Chia sẻ kinh nghiệm'
                                                                description="Giảng viên sẽ chia sẻ kinh nghiệm học tập và làm việc thực tế liên quan đến lập trình server-side với NodeJS, Express, và MongoDB."
                                                            />
                                                        </List.Item>
                                                    </List>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-3 */}
                                <div className='sub-3'>
                                    <div className='sub-3-content'>
                                        <h1 style={SubjectSubHeaderStyle}>
                                            Khóa học này dành cho:
                                        </h1>
                                        <List>
                                            <List.Item>
                                                <Typography.Text>
                                                    <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                    Học viên đang theo học môn Server-Side development with NodeJS, Express, and MongoDB.
                                                </Typography.Text>
                                            </List.Item>

                                            <List.Item>
                                                <Typography.Text>
                                                    <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                    Học viên có mong muốn củng cố kiến thức và kỹ năng lập trình server-side với NodeJS, Express, và MongoDB.
                                                </Typography.Text>
                                            </List.Item>

                                            <List.Item>
                                                <Typography.Text>
                                                    <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                    Học viên cần hỗ trợ để hoàn thành các bài tập (assignment) trong môn học.
                                                </Typography.Text>
                                            </List.Item>
                                        </List>
                                    </div>

                                    {/* Sub-4 */}
                                    <div className='sub-4' style={SubContentSpacing}>
                                        <div className="sub-4-content">
                                            <h1 style={SubjectSubHeaderStyle}>
                                                Hình thức học
                                            </h1>

                                            <List>
                                                <List.Item>
                                                    <Typography.Text>
                                                        <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                        Học trực tiếp.
                                                    </Typography.Text>
                                                </List.Item>

                                                <List.Item>
                                                    <Typography.Text>
                                                        <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                        Số lượng 1 sinh viên với mỗi lớp học
                                                    </Typography.Text>
                                                </List.Item>

                                                <List.Item>
                                                    <Typography.Text>
                                                        <Avatar style={{ backgroundColor: '#FF6636', marginRight: '12px' }} icon={<ArrowRightOutlined />} />
                                                        Thời lượng mỗi buổi học là 2 tiếng.
                                                    </Typography.Text>
                                                </List.Item>
                                            </List>
                                        </div>


                                        {/* Sub-5 */}
                                        <div className="sub-5" style={SubContentSpacing}>
                                            <div className="sub-5-content text-start">
                                                <h1 style={SubjectSubHeaderStyle}>
                                                    Giảng viên
                                                </h1>

                                                <List
                                                    itemLayout="vertical"
                                                    size="large"
                                                    dataSource={data}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.title}
                                                            actions={[
                                                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                                                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                                            ]}
                                                            extra={
                                                                <img
                                                                    width={272}
                                                                    alt="logo"
                                                                    src=""
                                                                    style={{ borderRadius: '50%' }}
                                                                />
                                                            }
                                                        >
                                                            <List.Item.Meta
                                                                title={<h3 href={item.href}>{item.title}</h3>}
                                                                description={item.description}
                                                            />
                                                            {item.content}
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Sub-6 */}
                                        <div className="sub-6">
                                            <div className="sub-6-content text-start">
                                                <h1 style={SubjectSubHeaderStyle}>
                                                    Đánh giá của học viên
                                                </h1>

                                                {/* <StudentRating /> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </Col>

                        {/* Slider - Aside */}
                        <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
                            <Card
                                style={{
                                    width: 400,
                                    height: 'max-content',
                                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                                    position: 'sticky',
                                    top: '5rem',
                                }}
                            >
                                <div className='slider'>
                                    <div className="body">
                                        <div className="header-1" style={HeaderSpacing}>
                                            <Row>
                                                <Col span={12}>
                                                    <h3 className='text-start'>{data.price}VND</h3>
                                                    <div className='d-flex' style={{ color: '#E34444' }}>
                                                        {/* Icon */}
                                                        <p style={{ marginRight: '4px' }}><FieldTimeOutlined /></p>
                                                        <p style={{ fontSize: '13px' }}>Còn 2 ngày ở mức giá này!</p>
                                                    </div>
                                                </Col>

                                                <Col span={12} style={{ textAlign: 'end' }}>
                                                    <Button
                                                        style={{
                                                            color: '#FF6636',
                                                            backgroundColor: '#FFEEE8',
                                                            textAlign: 'end',
                                                        }}
                                                        size='large'>
                                                        Giảm 25%
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div className="header-2" style={HeaderSpacing}>
                                            <Row>
                                                <Col span={12}>
                                                    <div className='d-flex'>
                                                        {/* Icon */}
                                                        <p style={{ marginRight: '12px', fontSize: '16px' }}><FieldTimeOutlined /></p>
                                                        <p>Thời gian</p>
                                                    </div>
                                                </Col>

                                                <Col span={12}>
                                                    <div className='text-end'>
                                                        <p>{data.duration} tiếng</p>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={12}>
                                                    <div className='d-flex'>
                                                        {/* Icon */}
                                                        <p style={{ marginRight: '12px', fontSize: '16px' }}><BookOutlined /></p>
                                                        <p>Học kỳ</p>
                                                    </div>
                                                </Col>

                                                <Col span={12}>
                                                    <div className='text-end'>
                                                        <p>7</p>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={12}>
                                                    <div className='d-flex'>
                                                        {/* Icon */}
                                                        <p style={{ marginRight: '12px', fontSize: '16px' }}><ProfileOutlined /></p>
                                                        <p>Phụ đề</p>
                                                    </div>
                                                </Col>

                                                <Col span={12}>
                                                    <div className='text-end'>
                                                        <p>Tiếng Anh</p>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={12}>
                                                    <div className='d-flex'>
                                                        {/* Icon */}
                                                        <p style={{ marginRight: '12px', fontSize: '16px' }}><ProfileOutlined /></p>
                                                        <p>Trạng thái</p>
                                                    </div>
                                                </Col>

                                                <Col span={12}>
                                                    <div className='text-end'>
                                                        <p>{data.status}</p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div className="header-3" style={HeaderSpacing}>
                                            <div className="btn-add-to-cart">
                                                <Button
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor: '#FF7F00',
                                                        width: '100%'
                                                    }}
                                                    size='large'
                                                >
                                                    Thêm vào Giỏ hàng
                                                </Button>
                                            </div>
                                            <br />
                                            <div className="btn-save">
                                                <Button
                                                    style={{
                                                        color: 'black',
                                                        backgroundColor: 'white',
                                                        width: '100%'
                                                    }}
                                                    size='large'
                                                >
                                                    Lưu lại
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default TutorDetail