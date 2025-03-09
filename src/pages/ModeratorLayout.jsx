import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;
function ModeratorLayout() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
           <Layout>
                <Content>
                    <div className='moderator-layout'>
                        <Outlet></Outlet>
                    </div>
                </Content>
             </Layout> 
        </div>
  )
}

export default ModeratorLayout