// src/hooks/useGeminiNews.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGeminiNews = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      const prompt = `Generate 15 latest technology news articles with titles and descriptions. 
        Return only a valid JSON array where each object has:
        - "title" (string): News headline
        - "description" (string): 1-2 sentence summary
        - "source" (string): Imaginary news source
        Example:
        [{
          "title": "Apple unveils new M3 chip with breakthrough performance",
          "description": "Apple's new M3 processor delivers 30% faster performance while using 20% less power than previous generation.",
          "source": "TechRadar"
        }]`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract and parse the response
      const responseText = response.data.candidates[0].content.parts[0].text;
      const parsedNews = JSON.parse(responseText.trim());
      
      // Add unique IDs and default fields for each article
      const formattedNews = parsedNews.map((article, index) => ({
        ...article,
        id: `${page}-${index}`,
        date: new Date().toISOString(),
        liked: false,
        saved: false
      }));

      setNews(prevNews => [...prevNews, ...formattedNews]);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
      // Return mock data if API fails (for development)
      setNews(prevNews => [...prevNews, ...getMockNews(page)]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for development
  const getMockNews = (pageNum) => {
    const mockTitles = [
      "Google announces breakthrough in quantum computing",
      "Microsoft unveils new AI-powered coding assistant",
      "Tesla achieves record battery production numbers",
      "Meta releases new VR headset with eye-tracking",
      "Amazon Web Services launches new AI tools"
    ];
    
    return mockTitles.map((title, index) => ({
      id: `mock-${pageNum}-${index}`,
      title,
      description: `This is a mock description for ${title}. In a real app, this would be fetched from the Gemini API.`,
      source: "TechNews Mock",
      date: new Date().toISOString(),
      liked: false,
      saved: false
    }));
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const refreshNews = () => {
    setNews([]);
    setPage(1);
  };

  return { 
    news, 
    loadMore, 
    loading, 
    error, 
    refreshNews 
  };
};

export default useGeminiNews;