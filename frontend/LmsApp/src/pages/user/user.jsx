import { useState, useEffect } from "react";
import "./user.css";
import axios from "axios";
function UserDashboard() {
  // User states
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("explore");
  
  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [count, setCount] = useState(0);
  
  // Book states
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [bookRatings, setBookRatings] = useState({});
  
  // Borrowing states
  const [burrowed, setBurrowed] = useState([]);
  const [burrowedBooks, setBurrowedBooks] = useState([]);
  
  // Modal states
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showBorrowConfirm, setShowBorrowConfirm] = useState(false);
  const [burrowingBook, setBurrowingBook] = useState(null);
  
  // Initialize current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Profile management states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileError, setProfileError] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const initializeProfileForm = () => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // const filterBooks = () => {
  //   let filtered = allBooks;

  //   // Filter by search term
  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (book) =>
  //         book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         (book.tags || []).some((tag) =>
  //           tag.toLowerCase().includes(searchTerm.toLowerCase())
  //         )
  //     );
  //   }

  //   // Filter by category
  //   if (selectedCategory !== "all") {
  //     filtered = filtered.filter((book) => book.category === selectedCategory);
  //   }

  //   setFilteredBooks(filtered);
  // };

  const getCategories = () => {
    const categories = [...new Set(books.map((book) => book.category))];
    return categories.sort();
  };

  // const handleBorrowBook = async () => {
  //   if (!borrowingBook || !currentUser) return;

  //   if (borrowRecord) {
  //     loadData(); // Refresh data
  //     setShowBorrowConfirm(false);
  //     setBurrowingBook(null);
  //     alert(
  //       `Successfully borrowed "${borrowingBook.title}"! Due date: ${new Date(
  //         borrowRecord.dueDate
  //       ).toLocaleDateString()}`
  //     );
  //   } else {
  //     alert(
  //       "Unable to borrow this book. It might be unavailable or you may have already borrowed it."
  //     );
  //   }
  // };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setProfileError("");
    setIsUpdatingProfile(true);

    // Validate password change (frontend check)
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

      // Send data to backend
      const response = await axios.put(
        `http://localhost:9000/api/users/update-profile/${currentUser._id}`,
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

        // Update localStorage user info
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Reset form fields
        setProfileForm({
          fullName: updatedUser.fullName,
          email: updatedUser.email,
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
      } else if (err.response?.status === 400) {
        setProfileError(err.response.data.message || "Invalid input. Please check your data.");
      } else {
        setProfileError(
          err.response?.data?.message || "Failed to update profile. Please try again."
        );
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  //   // Add password to updates if provided
  //   if (profileForm.newPassword) {
  //     updates.password = profileForm.newPassword;
  //   }

  //   const result = await updateProfile(updates);

  //   if (result.success) {
  //     setShowProfileModal(false);
  //     setProfileForm({
  //       fullName: profileForm.fullName,
  //       email: profileForm.email,
  //       currentPassword: '',
  //       newPassword: '',
  //       confirmPassword: ''
  //     });
  //     alert('Profile updated successfully!');
  //   } else {
  //     setProfileError(result.error || 'Failed to update profile.');
  //   }

  //   setIsUpdatingProfile(false);
  // };

 

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No authentication token found");
          return;
        }

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
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    fetchBookCount();
  }, []);

  // States are already declared at the top
  
  useEffect(() => {
    const getBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No authentication token found");
          return;
        }

        const response = await axios.get("http://localhost:9000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const booksData = response.data;
        
        // Generate fixed random ratings for new books
        const newRatings = {};
        booksData.forEach(book => {
          if (!bookRatings[book._id]) {
            // Generate a random rating between 3.0 and 9.9
            newRatings[book._id] = (Math.random() * 6.9 + 3).toFixed(1);
          }
        });
        
        setBookRatings(prevRatings => ({
          ...prevRatings,
          ...newRatings
        }));
        
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error("Error getting the books", error);
      }
    };
    getBooks();
  }, []);

  // Filter books when search or category changes
  useEffect(() => {
    let filtered = books;
    const searchTermLower = searchTerm.toLowerCase();

    // Filter by search term (including category)
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTermLower) ||
          book.author.toLowerCase().includes(searchTermLower) ||
          book.category.toLowerCase().includes(searchTermLower)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory]);

  const getBurrowingStatus = async () => {
    if (!currentUser?._id) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        `http://localhost:9000/api/books/burrowstatus/${currentUser._id}`,
        config
      );
      setBurrowed(response.data);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      if (err.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    getBurrowingStatus();
  }, [currentUser]);

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    // Simple date comparison
    if (now > due) {
      return { expired: true, text: "Overdue", color: "#ef4444" };
    }
    
    // Calculate days difference without using Math.floor
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

  // States are already declared at the top

  // loads books and burrow records
  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      //fetch all books
      const booksResponse = await axios.get("http://localhost:9000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setAllBooks(booksResponse.data);

      //only fetch burrowed books if user is logged in
      if (currentUser?._id && token) {
        const burrowedResponse = await axios.get(
          `http://localhost:9000/api/books/burrowstatus/${currentUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

        const burrowed = burrowedResponse.data.filter(
          (record) => record.status === "burrowed"
        );

        setBurrowedBooks(burrowed);
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

  const handleReturnBook = async (burrowRecord) => {
    if (
      window.confirm(
        `Are you sure you want to return '${burrowRecord.book.title}'?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login again to return books");
          window.location.href = '/login';
          return;
        }

        const response = await axios.put(
          `http://localhost:9000/api/books/return/${burrowRecord._id}`,
          {
            returnDate: new Date().toISOString(),
            status: "returned",
            bookId: burrowRecord.book._id,
            availableCopies: burrowRecord.book.availableCopies + 1 // Increase available copies
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        
        if (response.status === 200) {
          alert(`Successfully returned "${burrowRecord.book.title}"!`);
          
          // Update all relevant states
          await Promise.all([
            loadData(),         // Refresh book lists
            getBurrowingStatus() // Refresh borrowed/returned books
          ]);
          
          // Update filtered books to reflect the returned copy
          setFilteredBooks(prevBooks => 
            prevBooks.map(book => 
              book._id === burrowRecord.book._id
                ? { ...book, availableCopies: book.availableCopies + 1 }
                : book
            )
          );
        }
      } catch (error) {
        console.error("Error returning book:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          alert(
            error.response?.data?.message || 
            "Error returning book. Please try again or contact the developer!"
          );
        }
      }
    }
  }

    // States are already declared at the top

    //when a book card is clicked open book details model
    const handleSelectBook = (book) => {
      setSelectedBook(book); //store the full book object;
      setShowBookModal(true); //Open model
    };

    //check ifuser already burrowed the book
    const isAlreadyBorrowed = (bookId) => {
      return burrowedBooks.some(
        (record) => record.book?._id === bookId || record.book === bookId
      );
    };

    //burrow the book from backend after confirmation:
    const handleBurrowBook = async () => {
      if (!burrowingBook || !currentUser) {
        alert("Please login to borrow books");
        return;
      }
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

        console.log('Attempting to burrow book:', burrowingBook.title);

        // Send both user ID and book ID in the request payload
        const res = await axios.post(
          "http://localhost:9000/api/books/burrow",
          {
            userId: currentUser._id,     // Using 'userId' as the field name
            bookId: burrowingBook._id,   // Using 'bookId' as the field name
            borrowDate: new Date().toISOString(), // Adding borrow date
            status: "burrowed"          // Adding status field
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (res.data) {
          alert(
            `Successfully borrowed "${burrowingBook.title}"! Due: ${new Date(
              res.data.dueDate
            ).toLocaleDateString()}`
          );
          
          // Update UI states
          setShowBorrowConfirm(false);
          setBurrowingBook(null);
          setShowBookModal(false);
          
          // Refresh all data
          await Promise.all([
            loadData(),  // Refresh book lists
            getBurrowingStatus()  // Refresh borrowed books
          ]);
          
          // Force a re-render of filtered books
          setFilteredBooks(prevBooks => 
            prevBooks.map(book => 
              book._id === burrowingBook._id 
                ? { ...book, availableCopies: book.availableCopies - 1 }
                : book
            )
          );
        }
      } catch (error) {
        console.error("Error borrowing book:", error);
        if (error.response?.status === 400 && error.response?.data?.message?.includes("already borrowed")) {
          alert("You have already borrowed this book.");
          setShowBorrowConfirm(false);
          setBurrowingBook(null);
          await loadData(); // Refresh the data to show current state
        } else if (error.response?.status === 404) {
          alert("The burrow service is not available. Please try again later.");
        } else if (error.response?.status === 401) {
          alert("Please login again to burrow books.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          alert(error.response?.data?.message || "Unable to borrow this book. Please try again.");
        }
      }
    };

    const handlePrepareBurrow = (book) => {
      if (book.availableCopies > 0 && !isAlreadyBorrowed(book._id)) {
        setBurrowingBook(book); //store book for burrow;
        setShowBorrowConfirm(true);
      }
    };

    return (
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">📚 GyanKosh!</h1>
            <p className="dashboard-welcome">
              Welcome back, {currentUser?.fullName || 'User'}!
              
            </p>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setShowProfileModal(true)}
              className="profile-button"
            >
              👤 Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="logout-button"
            >
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
                  const isAlreadyBorrowed = burrowed.some(
                    (record) => record.book._id === book._id
                  );

                  return (
                    <div
                      key={book._id}
                      className="book-card"
                      onClick={() => {
                        // setSelectedBook(book);
                        // setShowBookModal(true);
                        handleSelectBook(book); //opens ddetaild model
                      }}
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

                        <div
                          className={`availability-badge ${
                            book.availableCopies > 0
                              ? "available"
                              : "unavailable"
                          }`}
                        >
                          {book.availableCopies > 0
                            ? "Available"
                            : "Unavailable"}
                        </div>

                        {/* Already borrowed badge */}
                        {isAlreadyBorrowed && (
                          <div className="borrowed-badge">Borrowed</div>
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

                        {/* Tags */}

                        {/* Action button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); //prevents triggering details model
                            handlePrepareBurrow(book);
                            if (
                              book.availableCopies > 0 &&
                              !isAlreadyBorrowed
                            ) {
                              setBurrowingBook(book);
                              setShowBorrowConfirm(true);
                            }
                          }}
                          disabled={
                            book.availableCopies === 0 || isAlreadyBorrowed
                          }
                          className={`borrow-button ${
                            book.availableCopies === 0 ? "unavailable" : ""
                          } ${isAlreadyBorrowed ? "borrowed" : ""}`}
                        >
                          {book.availableCopies === 0
                            ? "❌ Unavailable"
                            : isAlreadyBorrowed
                            ? "📖 Already Borrowed"
                            : "📥 Borrow Book"}
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

          {/* Borrowed Books Tab */}
          {activeTab === "borrowed" && (
            <div className="borrowed-tab">
              <h2 className="section-title">
                My Borrowed Books ({burrowed.length})
              </h2>

              {burrowed.length > 0 ? (
                <div className="borrowed-grid">
                  {burrowed.map((burrowRecord) => {
                    const book = burrowRecord.book;
                    const timeRemaining = getTimeRemaining(
                      burrowRecord.dueDate
                    );

                    if (!book) return null;

                    return (
                      <div key={burrowRecord._id} className="borrowed-card">
                        {/* Horizontal layout for borrowed books */}
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

                            {/* Borrow details */}
                            <div className="borrowed-meta">
                              <div className="borrowed-date">
                                Burrowed:{" "}
                                {new Date(
                                  burrowRecord.borrowDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="borrowed-date">
                                Due:{" "}
                                {new Date(
                                  burrowRecord.dueDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="borrowed-status">
                                <span>Status:</span>
                                <span
                                  className={`status-badge ${
                                    timeRemaining.expired ? "expired" : ""
                                  }`}
                                >
                                  {timeRemaining.text}
                                </span>
                              </div>
                            </div>

                            {/* Return button */}
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
                  <h3>No borrowed books</h3>
                  <p>
                    Start exploring our collection to borrow your first book!
                  </p>
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
                        <th>Borrowed Date</th>
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
                            <td className="history-date">{new Date(record.borrowDate).toLocaleDateString()}</td>
                            <td className="history-date">{new Date(record.returnDate).toLocaleDateString()}</td>
                            <td className="status-cell">
                              <span className="returned-badge">
                                Returned
                              </span>
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
              {/* Book cover section */}
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

              {/* Book details */}
              <div className="modal-content">
                <div className="modal-category">{selectedBook.category}</div>

                <h2 className="modal-title">{selectedBook.title}</h2>

                <p className="modal-author">by {selectedBook.author}</p>

                <div className="modal-stats">
                  {/* <div className="stat-item">
                    <div className="stat-value"></div>
                    <div className="stat-label">Rating</div>
                  </div> */}
                  {/* <div className="stat-item">
                    <div className="stat-value">{selectedBook.pages}</div>
                    <div className="stat-label">Pages</div>
                  </div> */}
                  <div className="stat-item">
                    <div className="stat-value">
                      {selectedBook.publishedYear}
                    </div>
                    <div className="stat-label">Published</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">
                      {selectedBook.availableCopies}
                    </div>
                    <div className="stat-label">Available</div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-heading">Description</h4>
                  <p className="section-text">{selectedBook.description}</p>
                </div>

                <div className="modal-section">
                  <h4 className="section-heading">Details</h4>
                  <div className="details-list">
                    <p>
                      <strong>Publisher:</strong> {selectedBook.publisher}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {selectedBook.isbn}
                    </p>
                  </div>
                </div>

                <div className="modal-section">
                  <h4 className="section-heading">Tags</h4>
                  <div className="tags-container">
                    {(selectedBook?.tags || []).map((tag, index) => (
                      <span key={index} className="modal-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="modal-actions">
                  <button
                    onClick={() => {
                      setShowBookModal(false);
                      setSelectedBook(null);
                    }}
                    className="secondary-button"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowBookModal(false);
                      setBurrowingBook(selectedBook);
                      setShowBorrowConfirm(true);
                    }}
                    disabled={
                      selectedBook.availableCopies === 0 ||
                      burrowedBooks.some(
                        (record) => record.book === selectedBook._id
                      )
                    }
                    className={`primary-button ${
                      selectedBook.availableCopies === 0 ||
                      burrowedBooks.some(
                        (record) => record.book === selectedBook._id
                      )
                        ? "disabled"
                        : ""
                    }`}
                  >
                    {selectedBook.availableCopies === 0
                      ? "Unavailable"
                      : burrowedBooks.some(
                          (record) => record.book === selectedBook._id
                        )
                      ? "Already Borrowed"
                      : "📥 Borrow Book"}
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
                Are you sure you want to borrow "
                <strong>{burrowingBook.title}</strong>" by{" "}
                {burrowingBook.author}?
              </p>

              <div className="loan-info">
                <p>
                  <strong>Loan Period:</strong> 15 days
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {(() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 15);
                    return date.toLocaleDateString();
                  })()}
                </p>
                <p>
                  <strong>Available Copies:</strong>{" "}
                  {burrowingBook.availableCopies}
                </p>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowBorrowConfirm(false);
                    setBurrowingBook(null);
                  }}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button onClick={handleBurrowBook} className="primary-button">
                  📥 Confirm Borrow
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

              {profileError && (
                <div className="error-message">{profileError}</div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        fullName: e.target.value,
                      })
                    }
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

                {/* Password change section */}
                <div className="password-section">
                  <h4 className="section-heading">
                    Change Password (Optional)
                  </h4>

                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="password-fields">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileModal(false);
                      setProfileError("");
                      initializeProfileForm();
                    }}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className={`primary-button ${
                      isUpdatingProfile ? "loading" : ""
                    }`}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="spinner" />
                        Updating...
                      </>
                    ) : (
                      "✅ Update Profile"
                    )}
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
