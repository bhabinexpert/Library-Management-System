import { useState, useEffect } from "react";
import "./user.css";
import axios from "axios";

function UserDashboard() {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("explore");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [count, setCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookRatings, setBookRatings] = useState({});
  const [burrowed, setBurrowed] = useState([]);
  const [isBurrowedLoading, setIsBurrowedLoading] = useState(false);
  const [burrowedBooks, setBurrowedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showBorrowConfirm, setShowBorrowConfirm] = useState(false);
  const [burrowingBook, setBurrowingBook] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileError, setProfileError] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Initialize current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      window.location.href = '/login';
      return;
    }
    
    setCurrentUser(JSON.parse(storedUser));
    loadData();
  }, []);



  // Get unique book categories
  const getCategories = () => {
    const categories = [...new Set(books.map((book) => book.category))];
    return categories.sort();
  };


    // Initialize profile form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        email: currentUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);


  // Update user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setProfileError("");
    setIsUpdatingProfile(true);


    // Require current password for any update
    if (!profileForm.currentPassword) {
      setProfileError("Current password is required to update profile");
      setIsUpdatingProfile(false);
      return;
    }

    
    // Password validation
    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileError("New passwords do not match.");
        setIsUpdatingProfile(false);
        return;
      }

      if (profileForm.newPassword.length < 6) {
        setProfileError("New password must be at least 6 characters long.");
        setIsUpdatingProfile(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProfileError("Please login again to update your profile");
        setIsUpdatingProfile(false);
        window.location.href = '/login';
        return;
      }

      // Send update request
      const response = await axios.put(
        `http://localhost:9000/api/users/${currentUser._id}`,
        {
          fullName: profileForm.fullName,
          email: profileForm.email,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword || undefined,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfileForm({
          ...profileForm,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.status === 401) {
        setProfileError("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        setProfileError(
          err.response?.data?.message || "Failed to update profile. Please try again."
        );
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Fetch book count
  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:9000/api/books/count", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setCount(response.data.totalBooks);
      } catch (error) {
        console.error("Error fetching book count:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchBookCount();
  }, []);

  // Fetch books
  useEffect(() => {
    const getBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:9000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const booksData = response.data;
        
        // Generate random ratings for books
        const newRatings = {};
        booksData.forEach(book => {
          if (!bookRatings[book._id]) {
            newRatings[book._id] = (Math.random() * 6.9 + 3).toFixed(1);
          }
        });
        
        setBookRatings(prev => ({ ...prev, ...newRatings }));
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error("Error getting books:", error);
      }
    };
    
    getBooks();
  }, []);

  // Filter books based on search and category
  useEffect(() => {
    let filtered = books;
    const searchTermLower = searchTerm.toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter(
        book => 
          book.title.toLowerCase().includes(searchTermLower) ||
          book.author.toLowerCase().includes(searchTermLower) ||
          book.category.toLowerCase().includes(searchTermLower)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory]);

  // Fetch borrowing status
  const getBurrowingStatus = async () => {
    if (!currentUser?._id) return;
    
    try {
      setIsBurrowedLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:9000/api/books/burrowstatus/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBurrowed(response.data || []);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsBurrowedLoading(false);
    }
  };

  useEffect(() => {
    getBurrowingStatus();
  }, [currentUser]);

  // Calculate time remaining for due dates
  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (now > due) {
      return { expired: true, text: "Overdue", color: "#ef4444" };
    }
    
    const timeDiff = due - now;
    const days = parseInt(timeDiff / (1000 * 60 * 60 * 24));
    const hours = parseInt((timeDiff / (1000 * 60 * 60)) % 24);

    if (days > 0) {
      return {
        expired: false,
        text: `${days} day${days > 1 ? "s" : ""} left`,
        color: days <= 3 ? "#f59e0b" : "#10b981",
      };
    } else {
      return {
        expired: false,
        text: `${hours} hour${hours > 1 ? "s" : ""} left`,
        color: "#ef4444",
      };
    }
  };

  // Load books and borrowing data
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch books
      const booksResponse = await axios.get("http://localhost:9000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBooks(booksResponse.data);

      // Fetch borrowed books
      if (currentUser?._id) {
        const burrowedResponse = await axios.get(
          `http://localhost:9000/api/books/burrowstatus/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const borrowed = burrowedResponse.data.filter(
          record => record.status === "burrowed" || record.status === "borrowed"
        );

        setBurrowedBooks(borrowed);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Handle book return
  const handleReturnBook = async (burrowRecord) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again to return books");
      window.location.href = '/login';
      return;
    }

    if (!window.confirm(`Return '${burrowRecord.book.title}'?`)) return;

    try {

       // Optimistically update UI by incrementing by 1
    setFilteredBooks(prevBooks => 
      prevBooks.map(book => 
        book._id === burrowRecord.book._id
          ? { ...book, availableCopies: book.availableCopies + 1 }
          : book
      )
    );

      await axios.put(
        `http://localhost:9000/api/books/return/${burrowRecord._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Successfully returned "${burrowRecord.book.title}"!`);
      
      // Refresh data
      await Promise.all([loadData(), getBurrowingStatus()]);
      
     
    } catch (error) {
      console.error("Error returning book:", error);
      alert(
        error.response?.data?.message || 
        "Error returning book. Please try again!!"
      );

      await loadData();
      if (error.response?.status === 401) handleLogout();
    }
  };

  // Handle book selection for details view
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  // Check if book is already borrowed
  const isAlreadyBorrowed = (bookId) => {
    return burrowedBooks.some(
      record => (record.book?._id === bookId || record.book === bookId) && 
      record.status === "burrowed"
    );
  };

  // Prepare book for borrowing
  const handlePrepareBurrow = (book) => {
    if (!currentUser) {
      alert("Please login to borrow books");
      window.location.href = '/login';
      return;
    }
    
    if (isAlreadyBorrowed(book._id)) {
      alert("You have already borrowed this book");
      return;
    }
    
    if (book.availableCopies <= 0) {
      alert("Sorry, this book is currently unavailable");
      return;
    }
    
    setBurrowingBook(book);
    setShowBorrowConfirm(true);
  };

  // Handle book borrowing
  const handleBurrowBook = async () => {
    if (!burrowingBook || !currentUser) {
      alert("Please login to borrow books");
      window.location.href = '/login';
      return;
    }

    //Disable button to prevent multiple clicks
    setShowBorrowConfirm(false);
    if (burrowingBook.availableCopies <= 0) {
      alert("This book is currently unavailable");
      return;
    }

    

    try {

      const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to borrow books");
      window.location.href = '/login';
      return;
    }

    
      // Check if already borrowed
      const statusResponse = await axios.get(
        `http://localhost:9000/api/books/burrowstatus/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const alreadyBurrowed = statusResponse.data.some(
        record => record.book._id === burrowingBook._id &&
                  record.status === "burrowed"
      );

      if (alreadyBurrowed) {
        alert("You have already borrowed this book");
        setShowBorrowConfirm(false);
        setBurrowingBook(null);
        await loadData();
        return;
      }

      // Borrow book
      const res = await axios.put(
        `http://localhost:9000/api/books/burrow/${burrowingBook._id}`,
        {
          user: currentUser._id,
          book: burrowingBook._id,
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (res.data) {
        alert(`Successfully borrowed "${burrowingBook.title}"!`);
        
        
        // Close modals
        setShowBorrowConfirm(false);
        setBurrowingBook(null);
        setShowBookModal(false);
        
        // Refresh data
        await Promise.all([loadData(), getBurrowingStatus()]);
        
        // Optimistic UI update
        setFilteredBooks(prevBooks =>
          prevBooks.map(book =>
            book._id === burrowingBook._id
              ? { ...book, availableCopies: book.availableCopies - 1 }
              : book
          )
        );

        //refresh data from server:
        await loadData();
        await getBurrowingStatus();
        
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      const message = error.response?.data?.message || "Unable to borrow book. Please try again.";
      alert(message);

      if (error.response?.status === 401) handleLogout();
      
      setShowBorrowConfirm(false);
      setBurrowingBook(null);
      await loadData();
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📚 GyanKosh!</h1>
          <p className="dashboard-welcome">
            Welcome back, {currentUser?.fullName.split(' ')[0] || 'User'}!        
            {/* {console.log(currentUser?.fullName)} */}

          </p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => setShowProfileModal(true)}
            className="profile-button"
          >
            👤 Profile
          </button>
          <button onClick={handleLogout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {[
            { id: "explore", label: "🔍 Explore Books", icon: "🔍" },
            { id: "borrowed", label: "📖 My Books", icon: "📖" },
            { id: "history", label: "📚 History", icon: "📚" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Explore Tab */}
        {activeTab === "explore" && (
          <div className="explore-tab">
            <div className="explore-header">
              <h2 className="section-title">
                Explore Books ({count} available)
              </h2>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search books, authors, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="books-grid">
              {filteredBooks.map((book) => {
                const isBookBurrowed = isAlreadyBorrowed(book._id);

                return (
                  <div
                    key={book._id}
                    className="book-card"
                    onClick={() => handleSelectBook(book)}
                  >
                    {/* Book cover */}
                    <div
                      className="book-cover"
                      style={{
                        background: `linear-gradient(135deg, ${book.coverImage}, ${book.coverImage}dd)`,
                      }}
                    >
                      <div className="book-icon">📖</div>

                      {/* Availability badge */}
                      <div className={`availability-badge ${book.availableCopies > 0 ? "available" : "unavailable"}`}>
                        {book.availableCopies > 0 ? "Available" : "Unavailable"}
                      </div>

                      {/* Already borrowed badge */}
                      {isBookBurrowed && (
                        <div className="borrowed-badge">Burrowed</div>
                      )}
                    </div>

                    {/* Book details */}
                    <div className="book-details">
                      <div className="book-category">{book.category}</div>
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>

                      <div className="book-meta">
                        <div className="book-rating">
                          <span className="star-icon">⭐</span>
                          <span>{bookRatings[book._id]}</span>
                        </div>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrepareBurrow(book);
                        }}
                        disabled={book.availableCopies === 0 || isBookBurrowed}
                        className={`borrow-button ${
                          book.availableCopies === 0 ? "unavailable" : ""
                        } ${isBookBurrowed ? "burrowed" : ""}`}
                      >
                        {book.availableCopies === 0 && !isBookBurrowed
                          ? "❌ Unavailable"
                          : isBookBurrowed
                          ? "📖 Already Burrowed"
                          : "📥 Burrow Book"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBooks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No books found</h3>
                <p>Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        )}

        {/* Burrowed Books Tab */}
        {activeTab === "borrowed" && (
          <div className="borrowed-tab">
            <h2 className="section-title">
              My Borrowed Books ({burrowedBooks.length})
            </h2>

            {burrowedBooks.length > 0 ? (
              <div className="borrowed-grid">
                {burrowedBooks.map((burrowRecord) => {
                  const book = burrowRecord.book;
                  if (!book) return null;
                  const timeRemaining = getTimeRemaining(burrowRecord.dueDate);

                  return (
                    <div key={burrowRecord._id} className="borrowed-card">
                      <div className="borrowed-card-inner">
                        {/* Book cover */}
                        <div
                          className="borrowed-cover"
                          style={{
                            background: `linear-gradient(135deg, ${book.coverImage}, ${book.coverImage}dd)`,
                          }}
                        >
                          <div className="borrowed-book-icon">📖</div>
                        </div>

                        {/* Book details */}
                        <div className="borrowed-details">
                          <div className="borrowed-category">
                            {book.category}
                          </div>
                          <h3 className="borrowed-title">{book.title}</h3>
                          <p className="borrowed-author">by {book.author}</p>

                          <div className="borrowed-meta">
                            <div className="borrowed-date">
                              Burrowed: {new Date(burrowRecord.borrowDate).toLocaleDateString()}
                            </div>
                            <div className="borrowed-date">
                              Due: {new Date(burrowRecord.dueDate).toLocaleDateString()}
                            </div>
                            <div className="borrowed-status">
                              <span>Status:</span>
                              <span className={`status-badge ${timeRemaining.expired ? "expired" : ""}`}>
                                {timeRemaining.text}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReturnBook(burrowRecord)}
                            className="return-button"
                          >
                            ↩️ Return Book
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No burrowed books</h3>
                <p>Start exploring our collection to borrow your first book!</p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="explore-button"
                >
                  🔍 Explore Books
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="history-tab">
            <h2 className="section-title">Reading History</h2>
            
            <div className="history-table-container">
              {burrowed.filter(record => record.status === "returned").length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Burrowed Date</th>
                      <th>Return Date</th>
                      <th className="status-header">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {burrowed
                      .filter(record => record.status === "returned")
                      .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate))
                      .map(record => (
                        <tr key={record._id}>
                          <td className="history-book-title">{record.book.title}</td>
                          <td className="history-book-author">{record.book.author}</td>
                          <td>{record.book.category}</td>
                          <td className="history-date">{new Date(record.burrowDate).toLocaleDateString()}</td>
                          <td className="history-date">{new Date(record.returnDate).toLocaleDateString()}</td>
                          <td className="status-cell">
                            <span className="returned-badge">Returned</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <h3>No reading history</h3>
                  <p>Books you return will appear here.</p>
                  <button
                    onClick={() => setActiveTab("explore")}
                    className="explore-button"
                  >
                    🔍 Explore Books
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      {showBookModal && selectedBook && (
        <div className="modal-overlay">
          <div className="book-modal">
            <div
              className="modal-cover"
              style={{
                background: `linear-gradient(135deg, ${selectedBook.coverImage}, ${selectedBook.coverImage}dd)`,
              }}
            >
              <div className="modal-book-icon">📖</div>
              <button
                onClick={() => setShowBookModal(false)}
                className="modal-close-button"
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-category">{selectedBook.category}</div>
              <h2 className="modal-title">{selectedBook.title}</h2>
              <p className="modal-author">by {selectedBook.author}</p>

              <div className="modal-stats">
                <div className="stat-item">
                  <div className="stat-value">{selectedBook.publishedYear}</div>
                  <div className="stat-label">Published</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{selectedBook.availableCopies}</div>
                  <div className="stat-label">Available Copies</div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-heading">Description : 🧠</h3>
                <p className="section-text">{selectedBook.description}</p>
              </div>

              <div className="modal-section">
                <h3 className="section-heading">Details : ⬇️</h3>
                <div className="details-list">
                  <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
                  <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                </div>
              </div>

              

              <div className="modal-actions">
                <button
                  onClick={() => setShowBookModal(false)}
                  className="secondary-button"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowBookModal(false);
                    handlePrepareBurrow(selectedBook);
                  }}
                  disabled={
                    selectedBook.availableCopies === 0 ||
                    isAlreadyBorrowed(selectedBook._id)
                  }
                  className={`primary-button ${
                    (selectedBook.availableCopies === 0 || 
                    isAlreadyBorrowed(selectedBook._id)) ? "disabled" : ""
                  }`}
                >
                  {selectedBook.availableCopies === 0 && !isAlreadyBorrowed
                    ? "Unavailable"
                    : isAlreadyBorrowed(selectedBook._id)
                    ? "Already Burrowed"
                    : "📥 Burrow Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borrow Confirmation Modal */}
      {showBorrowConfirm && burrowingBook && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3 className="modal-title">Confirm Borrowing</h3>
            <p className="modal-text">
              Are you sure you want to borrow "<strong>{burrowingBook.title}</strong>" by {burrowingBook.author}?
            </p>

            <div className="loan-info">
              <p><strong>Loan Period:</strong> 15 days</p>
              <p><strong>Due Date:</strong> {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              <p><strong>Available Copies:</strong> {burrowingBook.availableCopies}</p>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowBorrowConfirm(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button onClick={handleBurrowBook} className="primary-button">
                📥 Confirm Burrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <h3 className="modal-title">Update Profile</h3>

            {profileError && <div className="error-message">{profileError}</div>}

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                  required
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email (cannot be changed)</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="password-section">
                <h4 className="section-heading">Change Password (Optional)</h4>

                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="password-fields">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className={`primary-button ${isUpdatingProfile ? "loading" : ""}`}
                >
                  {isUpdatingProfile ? "Updating..." : "✅ Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;