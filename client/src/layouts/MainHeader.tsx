import React from 'react';
import { Layout, Typography, Avatar, Button } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { RootState, useAppDispatch } from '@/app/store';
import { decoded, setAllCookie, setKeyHeader } from '@/utils/jwt';
import { userAction } from '@/reducer/user/user.slice';
import { authAction } from '@/reducer/auth/auth.slice';
import { EKeyHeader } from '@/utils/enum';
import { Paragraph } from '@/utils/utils';

const { Header } = Layout;
const { Title } = Typography;
const headerStyle: React.CSSProperties = {
  display: 'flex',
  textAlign: 'center',
  color: '#fff',
  height: 90,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

function MainHeader({
  setIsOpenModalSignIn,
}: {
  setIsOpenModalSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useSelector((state: RootState) => state.user.currentUser, shallowEqual);
  const isSignIn = useSelector((state: RootState) => state.auth.isSignIn, shallowEqual);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    try {
      const accessToken = Cookies.get('accessToken');
      const userId = Cookies.get('userId');
      const decodeAccessToken = decoded(accessToken);

      if (accessToken && userId && decodeAccessToken) {
        setKeyHeader(accessToken, EKeyHeader.ACCESS_TOKEN);

        setKeyHeader(userId, EKeyHeader.USER_ID);

        dispatch(userAction.getMePending());
      } else if (userId && accessToken) {
        const refreshToken = decoded(Cookies.get('refreshToken'));

        if (refreshToken) dispatch(authAction.newAccessTokenPending(refreshToken.email));
      }
    } catch (error) {
      setAllCookie(true);
    }
  }, []);

  const handelButton = () => {
    if (isSignIn) {
      dispatch(authAction.signOutPending());
    } else {
      setIsOpenModalSignIn(true);
    }
  };

  return (
    <>
      <Header style={headerStyle}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: 10,
          }}
        >
          <div style={{ flexGrow: 1, width: '100%' }}>
            <Title level={4}>Interview</Title>
          </div>
          <div style={{ gap: '0px !important', flexGrow: 0, width: 120 }}>
            <Avatar
              size={45}
              src={user?.avatar && <img src={user.avatar} alt='avatar' />}
            />
            <Paragraph style={{ marginBottom: 0 }}>{user?.name}</Paragraph>
          </div>

          <Button onClick={handelButton}> {isSignIn ? ' Sign Out' : 'Sign In'}</Button>
        </div>
      </Header>
    </>
  );
}

export default MainHeader;

