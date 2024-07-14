import React from "react";
import { Navigate, Outlet, RouteProps } from "react-router-dom";
import useAuthenticate from "./useAuthenticate"; // 사용자 인증 상태를 확인하는 커스텀 훅

// PrivateRoute 컴포넌트의 Props 정의
interface PrivateRouteProps {
  authentication: boolean; // 인증이 필요한지 여부
  children?: React.ReactNode; // 자식 요소(여기서는 Route 컴포넌트들)를 받음
}

// PrivateRoute 컴포넌트 정의
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authentication,
  children,
}) => {
  const isAuthenticated = useAuthenticate(); // 사용자 인증 상태를 확인

  if (authentication) {
    // 인증이 필요한 페이지인 경우
    return isAuthenticated ? (
      // 인증되었으면 자식 요소(여기서는 Outlet)를 반환
      <Outlet />
    ) : (
      // 인증되지 않았으면 로그인 페이지로 리디렉션
      <Navigate to="/login" />
    );
  } else {
    // 인증이 필요하지 않은 페이지인 경우
    return isAuthenticated ? (
      // 인증되었으면 홈 페이지로 리디렉션
      <Navigate to="/" />
    ) : (
      // 인증되지 않았으면 자식 요소(여기서는 Outlet)를 반환
      <Outlet />
    );
  }
};

export default PrivateRoute;
