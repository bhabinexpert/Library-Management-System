import { use } from "react";
import "./user.css";
import { useState, useEffect } from "react";
import axios from "axios";
function UserDashboard() {

  const [activeTab, setActiveTab] = useState("explore");
  // const [borrowedBooks, setBorrowedBooks] = useState<BorrowingHistory[]>([]);
  // const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  // Book detail modal states
  // const [showBookModal, setShowBookModal] = useState(false);

  // const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // const [showBorrowConfirm, setShowBorrowConfirm] = useState(false);
  // const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);

  // Filter books when search or category changes
  // useEffect(() => {
  //   filterBooks();
  // }, [books, searchTerm, selectedCategory]);

  // const initializeProfileForm = () => {
  //   if (currentUser) {
  //     setProfileForm({
  //       fullName: currentUser.fullName,
  //       email: currentUser.email,
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //     });
  //   }
  // };

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

      // Send data to backend
      const response = await axios.put(
        `http://localhost:9000/update-profile/${currentUser._id}`,
        {
          fullName: profileForm.fullName,
          email: profileForm.email,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
      setProfileError(
        err.response?.data?.message || "Failed to update profile."
      );
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

 

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await axios.get("http://localhost:9000/count");
        console.log("Axios Response:", response); // log entire response
        console.log("Total Books from backend:", response.data.totalBooks);
        console.log(response.data.totalBooks);
        setCount(response.data.totalBooks);
      } catch (error) {
        console.log("Error fetching book Count:", error);
      }
    };

    fetchBookCount();
  }, []);

  const [books, setBooks] = useState([]);
  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await axios.get("http://localhost:9000/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error geeting the books", error);
      }
    };
    getBooks();
  }, []);

  const [burrowed, setBurrowed] = useState([]);

  useEffect(() => {
    const getBurrowingStatus = async () => {
      try {
        const response = await axios.get("http://localhost:9000/burrowstatus");
        setBurrowed(response.data);
      } catch {
        console.error("Error fetching borrowed books", err);
      }
    };
    getBurrowingStatus();
  }, []);

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { expired: true, text: "Overdue", color: "#ef4444" };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

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

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const [allBooks, setAllBooks] = useState([]);

  const [burrowedBooks, setBurrowedBooks] = useState([]);

  // loads books and burrow records
  const loadData = async () => {
    try {
      //fetch all books
      const booksResponse = await axios.get("http://localhost:9000/books");
      setAllBooks(booksResponse.data);

      //only fetch burrowed books if user is logged in

      if (currentUser?._id) {
        const burrowedResponse = await axios.get(
          `http://localhost:9000/burrowstatus/${currentUser._id}`
        );

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
        `Are you sure you want to return '${burrowRecord.books.title}'?`
      )
    ) {
      try {
        const response = await axios.put(
          `http://localhost:9000/return${burrowRecord._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(token)}`,
            },
          }
        );
        if (response.status === 200) {
          alert(`Successfully returned "${burrowRecord.book.title}"!`);
          loadData(); // Refresh book & borrowed lists
        }
      } catch (error) {
        console.eror("Error returning books:", error);
        alert(
          "Error returning book. Please try again or contact the developer!"
        );
      }
    }
  }

    const [selectedBook, setSelectedBook] = useState(null);
    const [burrowingBook, setBurrowingBook] = useState(null);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showBorrowConfirm, setShowBorrowConfirm] = useState(false);

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

    // const handleBurrowBook = async () => {
    //   if (!burrowingBook) return;
    //   try {
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     const res = await axios.post("http://localhost/9000/burrow", {
    //       user: user._id,
    //       book: burrowingBook._id,
    //     });
    //     alert(
    //       `Successfully burrowed "${burrowingBook.title}"! Due: ${new Date(
    //         res.data.dueDate
    //       ).toLocaleDateString()}`
    //     );
    //     setShowBorrowConfirm(false);
    //     setBorrowingBook(null);
    //     loadData();
    //   } catch (error) {
    //     console.error("Error burrowing book", error);
    //     alert("Unable to Burrow this book..");
    //   }
    // };

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
              Welcome back, User!
              
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
              // onClick={logout}
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
                {books.map((book) => {
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
                            <span>{Math.floor(Math.random() * 11)}</span>
                            {/* added random ratings because the ratings for books were not injected in db */}
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

              {books.length === 0 && (
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
                    const book = getBorrowedBookDetails(burrowRecord.Book);
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

              {currentUser &&
                (() => {
                  const allUserRecords = db.getBorrowingHistoryByUserId(
                    currentUser._id
                  );
                  const returnedBooks = allUserRecords.filter(
                    (record) => record.status === "returned"
                  );

                  return returnedBooks.length > 0 ? (
                    <div className="history-table-container">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Book</th>
                            <th>Borrowed</th>
                            <th>Returned</th>
                            <th className="status-header">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {returnedBooks.map((record) => {
                            const book = getBorrowedBookDetails(record.book);
                            const borrowDays = record.returnDate
                              ? Math.ceil(
                                  (new Date(record.returnDate).getTime() -
                                    new Date(record.borrowDate).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )
                              : 0;

                            return (
                              <tr key={record._id}>
                                <td>
                                  <div>
                                    <div className="history-book-title">
                                      {book?.title || "Unknown Book"}
                                    </div>
                                    <div className="history-book-author">
                                      by {book?.author}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="history-date">
                                    {new Date(
                                      record.borrowDate
                                    ).toLocaleDateString()}
                                  </span>
                                </td>
                                <td>
                                  <span className="history-date">
                                    {record.returnDate
                                      ? new Date(
                                          record.returnDate
                                        ).toLocaleDateString()
                                      : "Not returned"}
                                  </span>
                                </td>
                                <td className="status-cell">
                                  <span className="returned-badge">
                                    ✅ Returned ({borrowDays} days)
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h3>No reading history</h3>
                      <p>Your returned books will appear here.</p>
                    </div>
                  );
                })()}
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
                  {new Date(
                    Date.now() + 15 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
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
  };

export default UserDashboard;
