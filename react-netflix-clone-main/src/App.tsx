import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./PrivateRoute";
import FindPwd from "./Routes/FindPwd";
import Home from "./Routes/Home";
import Login from "./Routes/Login";
import Main from "./Routes/Main";
import Comment from "./Routes/MoreMovies/Comment";
import DetailMovies from "./Routes/MoreMovies/DetailMovies";
import MoreMovies_nowPlaying from "./Routes/MoreMovies/MoreMovies_nowPlaying";
import FailPage from "./Routes/payment/Fail";
import { Payment } from "./Routes/payment/Payment";
import BillingPage from "./Routes/payment/PaymentBilling";
import CheckoutPage from "./Routes/payment/PaymentCheckout";
import { SuccessPage } from "./Routes/payment/Success";
import Profile from "./Routes/Profile";
import Search from "./Routes/Search";
import SignUp from "./Routes/SignUp";
import Subscription from "./Routes/Subscription";
import Tv from "./Routes/Tv";
import Update from "./Routes/Update";

// 이거는 PrivateRoute, useAuthenticate 이거 이용해서 로그인한 사람만 들어가게하기
// 아니면 그냥 보여주기를 분리해둠
// 굳이 해야되나 싶긴했는데 생각나서 일단 했습니당.
// 로그인하면서 웹브라우저에 로컬스토리지에 로그인한 이메일을 저장해서 인증에 쓰는겁니다.

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 공개 페이지 */}
        <Route path="/" element={<Main />} />

        {/* 로그인 및 회원가입, 비번교체 페이지 */}
        <Route element={<PrivateRoute authentication={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/findPwd" element={<FindPwd />} />
        </Route>

        {/* 로그인이 필요한 페이지 */}
        <Route element={<PrivateRoute authentication={true} />}>
          <Route path="/movies" element={<Home />} />
          <Route path="/movies/:movieId" element={<Home />} />
          <Route path="/detail/:movieId" element={<DetailMovies />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:tvId" element={<Tv />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/update/:email" element={<Update />} />
          <Route path="/detail/:movieId" element={<DetailMovies />} />
          <Route path="/comment/:title/:movieId" element={<Comment />} />
          <Route path="/nowPlaying" element={<MoreMovies_nowPlaying />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/checkout" element = {<CheckoutPage />}/>
          <Route path="/payment/billing" element = {<BillingPage />}/>
          <Route path="/payment/success" element = {<SuccessPage />}/>
          <Route path="/payment/fail" element = {<FailPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
