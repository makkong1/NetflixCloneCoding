import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: black;
  font-size: 18px;
  font-weight: normal;
  padding: 20px 60px;
  color: white;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  cursor: pointer;
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;
const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
};

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
  width: 255px;
`;

const Login = styled.div`
  margin: 0 30px;
`;

const LoginButton = styled.div`
  margin: 0 30px;
  cursor: pointer;
`;

const LogOutButton = styled.div`
  margin: 0 30px;
  cursor: pointer;
`;

const Profile = styled(Link)`
  margin: 0 30px;
  cursor: pointer;
`;

const UserMenu = styled.div`
  width: 160px;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.black.lighter};
  position: relative;
  right: 0;
  margin-left: 20px;
  padding: 10px;
  border-radius: 5px;
`;
const Menu1 = styled.div`
  margin: 13px 0;
  position: absolute;
  border-radius: 5px;
  width: 160px;
  top: 100%; /* 부모 요소의 아래에 위치하도록 설정 */
  right: 0; /* 오른쪽 정렬 */
  background-color: ${(props) => props.theme.black.lighter}; /* 배경색 지정 */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
  padding: 10px; /* 내부 여백 설정 */
`;
const Menu2 = styled.div`
  position: absolute;
  margin-top: 25px;
  border-radius: 5px;
  width: 160px;
  top: 200%; /* 부모 요소의 아래에 위치하도록 설정 */
  right: 0; /* 오른쪽 정렬 */
  background-color: ${(props) => props.theme.black.lighter}; /* 배경색 지정 */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* 그림자 효과 추가 */
  padding: 10px; /* 내부 여백 설정 */
`;

const Subscription = styled.div`
  width: 50px;
  font-size: 15px;
  margin-left: 5px;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: tomato;
  position: absolute;
  right: 5px;
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
`;

const SubscriptionLink = styled(Link)`
  color: ${(props) => props.theme.white};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/movies");
  const tvMatch = useMatch("/tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<{ email: string | null }>({ email: null });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    navigate("/");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowUserMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowUserMenu(false);
    }, 500);
  };

  const toggleSearch = () => {
    if (searchOpen) {
      // trigger the close animation
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      // trigger the open animation
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);

  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
  };

  const userEmail = window.localStorage.getItem("username");
  useEffect(() => {
    if (userEmail === null) {
      setUser({ email: null });
      if (setUser === null) {
        navigate("/login");
      }
    } else {
      setUser({ email: userEmail });
    }
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    setUser({ email: null });
    navigate("/");
  };

  // 조건부 렌더링, /main 경로일 때는 Header를 렌더링하지 않음
  // const location = useLocation();
  // if (location.pathname === "/") {
  //   return null;
  // }

  return (
    <Nav initial={"top"} variants={navVariants} animate={navAnimation}>
      <Col>
        <Logo
          variants={logoVariants}
          whileHover="active"
          animate="normal"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
          onClick={handleClick}
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Items>
            <Item>
              <Link to="/movies">
                Movies {homeMatch && <Circle layoutId="circle" />}
              </Link>
            </Item>
            <Item>
              <Link to="/tv">
                Series {tvMatch && <Circle layoutId="circle" />}
              </Link>
            </Item>
          </Items>
        </Items>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -215 : 0 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            cursor="pointer"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="Search for movie or tv show"
          />
        </Search>
        {user.email ? (
          <UserMenu
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              {user.email}님
              {showUserMenu && (
                <Menu1>
                  <Profile to={`/profile/${user.email}`}>회원 정보</Profile>
                </Menu1>
              )}
              {showUserMenu && (
                <Menu2>
                  <LogOutButton onClick={handleLogout}>로그아웃</LogOutButton>
                </Menu2>
              )}
            </div>
          </UserMenu>
        ) : (
          <Login>
            <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
          </Login>
        )}
        <Subscription>
          <SubscriptionLink to="/subscription">구독</SubscriptionLink>
        </Subscription>
      </Col>
    </Nav>
  );
}
export default Header;
