// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useGeminiNews from "../hooks/useGeminiNews";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Box,
  Modal,
  Divider,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Favorite,
  Bookmark,
  ExitToApp,
  ThumbUp,
  Share,
} from "@mui/icons-material";

function Home() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { news, loadMore } = useGeminiNews();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      {/* AppBar with Dashboard Button */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tech News
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem button>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText primary="Liked Articles" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Bookmark />
              </ListItemIcon>
              <ListItemText primary="Saved Articles" />
            </ListItem>
            <Divider />
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* News Articles */}
      <div className="container" style={{ padding: "16px" }}>
        <h2>Tech News</h2>
        {news.map((article, index) => (
          <Card
            key={index}
            sx={{ margin: "10px", cursor: "pointer" }}
            onClick={() => handleArticleClick(article)}
          >
            <CardContent>
              <Typography variant="h6">{article.title}</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton aria-label="like">
                  <ThumbUp />
                </IconButton>
                <IconButton aria-label="save">
                  <Bookmark />
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Article Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {selectedArticle && (
              <>
                <Typography variant="h5" gutterBottom>
                  {selectedArticle.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedArticle.description || "No description available."}
                </Typography>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    mt: 2,
                  }}
                >
                  <IconButton aria-label="like">
                    <Favorite />
                  </IconButton>
                  <IconButton aria-label="save">
                    <Bookmark />
                  </IconButton>
                  <IconButton aria-label="share">
                    <Share />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Home;