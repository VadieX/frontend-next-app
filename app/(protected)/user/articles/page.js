'use client';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchArticles(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchArticles = async (userId) => {
    const db = getFirestore();
    const q = query(collection(db, "articles"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const articlesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setArticles(articlesList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const db = getFirestore();
    const article = { title, content, date, userId: user.uid };
    await addDoc(collection(db, "articles"), article);
    setTitle('');
    setContent('');
    setDate('');
    fetchArticles(user.uid);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Artykuły</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tytuł:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Treść:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500 focus:outline-none bg-gray-100 text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-500 focus:outline-none"
        >
          Dodaj artykuł
        </button>
      </form>

      <div className="mt-10">
        {articles.length === 0 ? (
          <div className="text-gray-700">Brak artykułów.</div>
        ) : (
          <ul className="space-y-4">
            {articles.map(article => (
              <li key={article.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
                <p className="text-gray-700">{article.content}</p>
                <p className="text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddArticleForm;