import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiThumbsUp, FiBookmark, FiShare2, FiLogOut, FiArrowLeft } from "react-icons/fi";
import "./Home.css";
import { dummyNews } from "./dummyNews";

export default function Home() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [currentView, setCurrentView] = useState("home"); // Tracks the current view: 'home', 'likes', or 'saved'

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const toggleSave = (id) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
    );
  };

  const handleShare = (news) => {
    const shareContent = `**${news.title}**\n\n${news.description}`;
    if (navigator.share) {
      navigator
        .share({
          title: news.title,
          text: shareContent,
          url: window.location.href, // Replace with the actual article URL if available
        })
        .then(() => console.log("Content shared successfully!"))
        .catch((error) => console.error("Error sharing content:", error));
    } else {
      // Fallback: Copy the content to the clipboard
      navigator.clipboard.writeText(shareContent).then(() => {
        alert("Content copied to clipboard!");
      });
    }
  };

  const renderPosts = (posts) => (
    <main className="news-grid">
      {posts.map((news) => (
        <div key={news.id} className="news-card">
          <h2>{news.title}</h2>
          <p>{news.description}</p>
          <div className="news-actions">
            <FiThumbsUp
              onClick={() => toggleLike(news.id)}
              style={{ color: likedPosts.includes(news.id) ? "red" : "black", cursor: "pointer" }}
            />
            <FiBookmark
              onClick={() => toggleSave(news.id)}
              style={{ color: savedPosts.includes(news.id) ? "blue" : "black", cursor: "pointer" }}
            />
            <FiShare2
              onClick={() => handleShare(news)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      ))}
    </main>
  );

  return (
    <div className="home-container">
      <header className="top-bar">
        {currentView !== "home" ? (
          <button className="menu-btn" onClick={() => setCurrentView("home")}>
            <FiArrowLeft size={24} />
          </button>
        ) : (
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
        )}
        <h1 className="app-title" style={{ textAlign: "center", flex: 1 }}>TechNewz</h1>
      </header>

      {/* Sidebar */}
      {sidebarOpen && currentView === "home" && (
        <div className="sidebar">
          <button className="sidebar-link" onClick={() => setCurrentView("likes")}>
            ❤️ Likes
          </button>
          <button className="sidebar-link" onClick={() => setCurrentView("saved")}>
            🔗 Saved
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}

      {/* Content */}
      {currentView === "home" && renderPosts(dummyNews)}
      {currentView === "likes" && renderPosts(dummyNews.filter((news) => likedPosts.includes(news.id)))}
      {currentView === "saved" && renderPosts(dummyNews.filter((news) => savedPosts.includes(news.id)))}

      {/* Modal */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedNews.title}</h2>
            <p>{selectedNews.description}</p>
            <div className="modal-actions">
              <FiThumbsUp
                onClick={() => toggleLike(selectedNews.id)}
                style={{ color: likedPosts.includes(selectedNews.id) ? "red" : "black", cursor: "pointer" }}
              />
              <FiBookmark
                onClick={() => toggleSave(selectedNews.id)}
                style={{ color: savedPosts.includes(selectedNews.id) ? "blue" : "black", cursor: "pointer" }}
              />
              <FiShare2
                onClick={() => handleShare(selectedNews)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}