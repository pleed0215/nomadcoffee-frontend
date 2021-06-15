import React, { useEffect, useRef, useState } from "react";
import { useReactiveVar } from "@apollo/client";
import {
  faPlusSquare,
  faMoon,
  faSearch,
  faSignOutAlt,
  faSun,
  faTimesCircle,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import { faPlusSquare as farPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  authTokenVar,
  darkModeVar,
  makeLogout,
  setDarkMode,
} from "../apollo/vars";
import { useMe } from "../hooks/useMe";
import { device } from "../theme/theme";
import { Avatar } from "./Avatar";
import { LayoutContainer } from "./LayoutContainer";
import { ToggleSwitch } from "./ToggleSwitch";

import { ReactComponent as CoffeeBean } from "../assets/bean.svg";

const HeaderContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.background.secondary};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  color: ${(props) => props.theme.color.secondary};
  display: flex;
  justify-content: center;
  transition: background-color 0.4s;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8;
`;

const Container = styled(LayoutContainer)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${device.xs} {
    padding-left: 5px;
    padding-right: 5px;
  } ;
`;

const LogoContainer = styled.div`
  flex: 1 0 0%;
`;
const SearchContainer = styled.form`
  ${device.xs} {
    display: none;
  }
  width: 215px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
`;
const MenuContainer = styled.div`
  flex: 1 0 0%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MenuLink = styled(Link)`
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const IconMenu = styled(FontAwesomeIcon)`
  color: ${(props) => props.color};
`;

const IconSearch = styled(FontAwesomeIcon)`
  position: absolute;
  left: 5px;
  color: darkgray;
`;
const IconReset = styled(FontAwesomeIcon)`
  position: absolute;
  right: 5px;
  color: darkgray;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px 10px 5px 20px;
  border-radius: 5px;
  outline: none;
  background-color: #efefef;
  border: 1px solid ${(props) => props.theme.color.border};
  font-size: 12px;
`;

const ToggleDarkContainer = styled.div`
  display: flex;
  align-items: center;
  & > :not(:last-child) {
    margin-right: 10px;
    margin-left: 10px;
  }
`;

const IconSun = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.color.secondary};
`;

const AvatarWrapper = styled.button`
  padding: 0;
  position: relative;
`;

const AvatarMenuWrapper = styled.div<{ visible: boolean }>`
  position: absolute;
  width: 230px;
  height: auto;
  background-color: white;
  border-radius: 4px;
  padding: 8px 16px;
  top: 35px;
  right: -5px;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.3);
  z-index: 8;
  display: flex;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  transition: opacity 0.4s;
  flex-direction: column;
  &:before {
    content: "";
    // https://didqk.tistory.com/entry/css-%EB%A1%9C-%EC%82%BC%EA%B0%81%ED%98%95-%EA%B7%B8%EB%A6%AC%EA%B8%B0
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    border-top: 10px solid none;
    position: absolute;
    top: -5px;
    right: 10px;
  }
`;

const AvatarMenuItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
  width: 100%;
  &:first-child {
    margin-right: 10px;
  }
  margin-top: 4px;
  margin-bottom: 4px;
`;

const AvatarMenuItemIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const SpanAvatarMenuItem = styled.span`
  color: inherit;
`;

const AvatarMenuSeperator = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0px;
  background-color: ${(props) => props.theme.color.border};
`;

const Home = styled.h1`
  color: inherit;
  font-size: 1.7rem;
`;

export const Header: React.FC = () => {
  const [term, setTerm] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const isLoggedIn = useReactiveVar(authTokenVar);

  const [clickedMenu, setClickedMenu] = useState(0);
  const onDarkModeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDarkMode(e.target.checked);
  };
  const isDark = useReactiveVar(darkModeVar);
  const { data: me } = useMe();
  let hTimeout: NodeJS.Timeout | null = null;
  const onToggleMenu = () => {
    if (menuVisible) {
      seedMenuCloseTimer();
    } else {
      setMenuVisible(true);
    }
  };
  const seedMenuCloseTimer = () => {
    setClickedMenu(0);
    if (menu.current) {
      menu.current.style.opacity = "0";
    }
    if (hTimeout) {
      clearTimeout(hTimeout);
    }
    hTimeout = setTimeout(() => {
      if (menu.current) {
        menu.current.style.display = "none";
      }
      setMenuVisible(false);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (hTimeout) {
        clearTimeout(hTimeout);
      }
    };
  }, [hTimeout]);

  const onMenuClicked = (index: number) => () => setClickedMenu(index);
  const history = useHistory();

  return (
    <HeaderContainer>
      <Container>
        <LogoContainer>
          <Link to="/">
            <Home>
              <CoffeeBean
                width="15"
                height="15"
                fill="white"
                style={{ marginRight: 8 }}
              />
              NOMAD COFFEE
            </Home>
          </Link>
        </LogoContainer>
        <SearchContainer action="/search" method="GET">
          <IconSearch icon={faSearch} size="xs" />
          <SearchInput
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            type="text"
            placeholder="검색"
            name="term"
          />
          <IconReset
            icon={faTimesCircle}
            size="xs"
            onClick={() => setTerm("")}
          />
        </SearchContainer>
        <MenuContainer>
          {isLoggedIn && (
            <MenuLink to="/add" onClick={onMenuClicked(0)}>
              <IconMenu
                icon={clickedMenu === 0 ? faPlusSquare : farPlusSquare}
                size="lg"
              />
            </MenuLink>
          )}
          {/*
          <MenuLink to="/direct" onClick={onMenuClicked(1)}>
            <IconMenu
              icon={clickedMenu === 1 ? faPaperPlane : farPaperPlane}
              size="lg"
            />
          </MenuLink>
          {/* <MenuLink to="/activity" onClick={onMenuClicked(2)}>
            <IconMenu
              icon={clickedMenu === 2 ? faCompass : farCompass}
              size="lg"
            />
          </MenuLink>*/}

          {isLoggedIn && (
            <AvatarWrapper
              onClick={() => {
                onMenuClicked(3)();
                onToggleMenu();
              }}
              onBlur={() => seedMenuCloseTimer()}
            >
              <Avatar
                url={me?.me?.avatarURL}
                size="lg"
                outline={clickedMenu === 3}
              />
              {menuVisible && (
                <AvatarMenuWrapper visible={menuVisible} ref={menu}>
                  <AvatarMenuItem>
                    <Link to={`/users/${me?.me?.id}`}>
                      <AvatarMenuItemIcon icon={faUserCircle} size="lg" />
                      <SpanAvatarMenuItem>프로필</SpanAvatarMenuItem>
                    </Link>
                  </AvatarMenuItem>
                  <AvatarMenuSeperator />
                  <AvatarMenuItem>
                    <Link to={`/add`}>
                      <AvatarMenuItemIcon icon={faPlusSquare} size="lg" />
                      <SpanAvatarMenuItem>커피샵 만들기</SpanAvatarMenuItem>
                    </Link>
                  </AvatarMenuItem>
                  <AvatarMenuItem>
                    <Link to={`/search`}>
                      <AvatarMenuItemIcon icon={faSearch} size="lg" />
                      <SpanAvatarMenuItem>검색하기</SpanAvatarMenuItem>
                    </Link>
                  </AvatarMenuItem>
                  <AvatarMenuSeperator />
                  <AvatarMenuItem
                    onClick={() => {
                      makeLogout();
                      history.push("/");
                    }}
                  >
                    <AvatarMenuItemIcon icon={faSignOutAlt} size="lg" />
                    <SpanAvatarMenuItem>로그아웃</SpanAvatarMenuItem>
                  </AvatarMenuItem>
                </AvatarMenuWrapper>
              )}
            </AvatarWrapper>
          )}

          <ToggleDarkContainer>
            <IconSun icon={isDark ? faMoon : faSun} />
            <ToggleSwitch
              onChange={onDarkModeChange}
              defaultChecked={darkModeVar()}
            />
          </ToggleDarkContainer>
        </MenuContainer>
      </Container>
    </HeaderContainer>
  );
};
