import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AlertMsg from '@components/AlertMsg';
import MainFooter from './MainFooter';
import NavigationListener from '@/components/NavigationListener';
import MainHeader from './MainHeader';
import SignInModal from '@/components/Modal/SignInModal';
import SignUpModal from '@/components/Modal/SignUpModal';

function MainLayout() {
  const [isOpenModalSignIn, setIsOpenModalSignIn] = useState<boolean>(false);
  const [isOpenModalSignUp, setIsOpenModalSignUp] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        rowGap: 10,
      }}
    >
      <NavigationListener />
      <MainHeader setIsOpenModalSignIn={setIsOpenModalSignIn} />
      <Outlet context={{ setIsOpenModalSignIn, setIsOpenModalSignUp }} />
      <AlertMsg />
      <SignInModal
        isOpenModal={isOpenModalSignIn}
        setIsOpenModal={setIsOpenModalSignIn}
        setIsOpenModalSignUp={setIsOpenModalSignUp}
      />
      <SignUpModal
        isOpenModal={isOpenModalSignUp}
        setIsOpenModal={setIsOpenModalSignUp}
      />
      <MainFooter />
    </div>
  );
}

export default MainLayout;

