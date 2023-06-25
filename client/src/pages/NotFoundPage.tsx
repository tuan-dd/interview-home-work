import { Typography } from 'antd';

const { Title } = Typography;
function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Title level={3}> Not Found Page</Title>
    </div>
  );
}

export default NotFoundPage;

