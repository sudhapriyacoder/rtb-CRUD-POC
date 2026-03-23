import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
} from "@mui/material";

export const Header = () => {
  const [anchorElUser, setAnchorElUser] =
    useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    "Profile",
    "Account",
    "Dashboard",
    "Logout",
  ];

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{ backgroundColor: "white" }}
      
    >
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between" }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                fontSize: "1.25rem",
                ml: 4
              }}
            >
              USER MANAGEMENT
            </Typography>
          </Box>

          {/* Profile Section */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, mr: 4 }}
              >
                <Avatar
                  alt="Profile"
                  src="https://images.unsplash.com/photo-1586006552150-b5778e96a842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5lcmljJTIwZ3JheSUyMHVzZXIlMjBwcm9maWxlJTIwc2lsaG91ZXR0ZSUyMGF2YXRhcnxlbnwxfHx8fDE3NzQyNTExMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
    </AppBar>
  );
};