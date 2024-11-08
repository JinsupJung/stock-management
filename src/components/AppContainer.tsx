'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // NextAuth의 useSession 훅 사용
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import customIcon from '/public/nolboo_logo.png';

export default function AppContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession(); // 세션 상태 확인

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleItemClick = (path: string) => {
    if (!session) {
      alert('로그인이 필요합니다.');
      return;
    }
    router.push(path); // 로그인 상태일 때만 이동
  };

  const drawerLinks = [
    {
      name: '직영 매입 관리',
      icon: <InventoryIcon />,
      path: '/buy',
    },
    {
      name: '재고 매장간 이동',
      icon: <TrendingFlatIcon />,
      path: '/move',
    },
    {
      name: '월말 재고 실사',
      icon: <EventRepeatIcon />,
      path: '/inven',
    },
  ];

  const drawer = (
    <>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Link href="/">
          {/* <StorefrontIcon
            sx={{
              fontSize: { xs: 35, sm: 45 },
              color: {
                xs: 'hsla(185, 64%, 39%, 1.0)',
              },
            }}
          /> */}
          <Image
            src={customIcon}
            alt="nolboo"
            width={145} // Set the size
            height={45} // Set the size
          />
        </Link>
      </Toolbar>

      <Divider />

      <List>
        {drawerLinks.map((drawLink, index) => (
          <ListItem key={index} disablePadding onClick={handleDrawerClose}>
            {/* disabled={true}는 화면에서 비활성화는 가능하지만, 클릭 이벤트까지 막지 않으므로 onClick에서 처리 */}
            <ListItemButton
              disableRipple
              sx={{
                width: '100vw',
              }}
              onClick={() => handleItemClick(drawLink.path)} // 버튼 클릭 시 로그인 여부 확인
            >
              <ListItemIcon>{drawLink.icon}</ListItemIcon>
              <ListItemText
                primary={drawLink.name}
                sx={{ color: 'rgb(75, 85, 99)' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* reset defaults */}
      <CssBaseline />

      {/* header */}
      <AppBar>
        <Toolbar sx={{ backgroundColor: '#ffffff' }}>
          <IconButton
            sx={{ mr: 2, display: { sm: 'none' }, color: 'black' }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* navbar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        <Drawer
          variant="permanent"
          open={true}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* main */}
      <Box
        component="main"
        sx={{
          height: '100%',
          margin: '50px auto',
          padding: '2rem',
          color: 'rgb(75, 85, 99)',
          width: { xs: '100%', sm: '70%' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
