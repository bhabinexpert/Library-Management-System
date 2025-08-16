import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin.css";
import { deleteUser, registerUser, updateUser } from "../../services/userApi";
import { addBook, deleteBook, updateBook } from "../../services/bookApi";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/books/count"
        );
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

  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const TotalUsersCount = async () => {
      try {
        const response = await axios.get("http://localhost:9000/totalusers");
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.log("Error while getting total users!", error);
      }
    };
    TotalUsersCount();
  }, []);

  const [burrowedBooksCount, setBurowedBooksCount] = useState(0);

  useEffect(() => {
    const fetchBurrowedBookscount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/stats/burrowed/count"
        );
        setBurowedBooksCount(response.data.burrowedBooksCount);
      } catch (error) {
        console.error("Error fetching burrowed book count:", error);
      }
    };

    fetchBurrowedBookscount();
  }, []);

  const [overdueBooksCount, setOverdueBooksCount] = useState(0);

  useEffect(() => {
    const fetchOverdueBooksCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/burrowings/overdue"
        );
        setOverdueBooksCount(response.data.overdueBooksCount);
      } catch (error) {
        console.error("Error fetching overdue books count:", error);
      }
    };

    fetchOverdueBooksCount();
  }, []);

  
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/category-counts"
        );
        console.log("Category counts:", res.data);
        setStatistics(res.data);
      } catch (error) {
        console.error("Error fetching category counts:", error);
      }
    };

    fetchCategoryCounts();
  }, []);

  const [books, setBooks] = useState([]);
  const [burrowRecords, setBurrowRecords] = useState([]);

  // loads books and burrow records
  const loadData = async () => {
    try {
      //fetch all books
      const booksResponse = await axios.get("http://localhost:9000/api/books");
      setBooks(booksResponse.data);

      //fetch all burrowings
      const burrowResponse = await axios.get(
        "http://localhost:9000/api/burrowings"
      );
      setBurrowRecords(burrowResponse.data);
      console.log(burrowResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (activeTab === "users") {
      const fetchUsersWithBurrowCount = async () => {
        try {
          //  Fetch all users
          const res = await axios.get("http://localhost:9000/api/userdata");
          const usersData = res.data;

          //  Fetch borrow counts for each user in parallel
          const burrowCounts = await Promise.all(
            usersData.map(async (user) => {
              const burrowRes = await axios.get(
                `http://localhost:9000/api/books/burrowstatus/${user._id}`
              );
              const currentBurrows = Array.isArray(burrowRes.data)
                ? burrowRes.data.filter(
                    (record) =>
                      record.status === "burrowed" ||
                      record.status === "borrowed"
                  ).length
                : 0;

              return {
                ...user,
                currentBurrows,
              };
            })
          );
          //update the state
          setUsers(burrowCounts);

          // console.log("Users with borrow count:", burrowCounts);
        } catch (error) {
          console.error("Error fetching users or borrow counts:", error);
        }
      };

      fetchUsersWithBurrowCount();
    }
  }, [activeTab]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    description: "",
    publisher: "",
    publishedYear: new Date().getFullYear(),
    coverImage: "",
    availableCopies: null ,
    totalCopies: null,
  });


  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = await registerUser(userForm);
      alert(`User ${newUser.fullName} added successfully!`);

      // update frontend list without full reload
      setUsers((prev) => [...prev, newUser]);
      resetUserForm();
      setShowAddUserModal(false);
      loadData();
    } catch (err) {
      alert("Error adding user.");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updatedUser = await updateUser(selectedUser._id, {
        fullName: userForm.fullName,
        email: userForm.email,
        currentPassword: userForm.currentPassword,
        role: userForm.role,
      });
      
      alert(`User ${updatedUser.fullName} updated successfully!`);

       // update frontend list
      setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
      resetUserForm();
      setSelectedUser(null);
      setShowEditUserModal(false);
      loadData();
    } catch (err) {
      alert("Error updating user.");
      console.log(err)
    }
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUser(user._id);
        alert(`User ${user.fullName} deleted successfully.`);

        // update frontend
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        loadData();
      } catch (err) {
        alert("Error deleting user.");
      }
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    // validate cover image url
  if (!bookForm.coverImage || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(bookForm.coverImage)) {
    alert("Please provide a valid cover image URL.");
    return;
  }
    try {
      const newBook = await addBook({
        ...bookForm,
        availableCopies: bookForm.totalCopies,
        
      });
      alert(`Book "${newBook.title}" added successfully!`);

       // update frontend list
      setBooks((prev) => [...prev, newBook]);
      resetBookForm();
      setShowAddBookModal(false);
      loadData();
    } catch (err) {
      alert("Error adding book.");
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      const updatedBook = await updateBook(selectedBook._id, {
        title: bookForm.title,
        author: bookForm.author,
        category: bookForm.category,
        isbn: bookForm.isbn,
        description: bookForm.description,
        publisher: bookForm.publisher,
        publishedYear: bookForm.publishedYear,
        // coverImage: bookForm.coverImage,
        totalCopies: bookForm.totalCopies,
        availableCopies: bookForm.availableCopies,
      });
      alert(`Book "${updatedBook.title}" updated successfully!`);

      // update frontend list
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );


      resetBookForm();
      setSelectedBook(null);
      setShowEditBookModal(false);
      loadData();
    } catch (err) {
      alert("Error updating book.");
    }
  };

  const handleDeleteBook = async (book) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteBook(book._id);
        alert(`Book "${book.title}" deleted successfully.`);

        // update frontend
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
      
        loadData();
      } catch (err) {
        alert("Error deleting book.");
      }
    }
  };

  const resetUserForm = () => {
    setUserForm({
      fullName: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const resetBookForm = () => {
    setBookForm({
      title: "",
      author: "",
      category: "",
      isbn: "",
      description: "",
      publisher: "",
      publishedYear: new Date().getFullYear(),
      coverImage: "",
      availableCopies: 1,
      totalCopies: 1,
    });
  };

  const openEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowEditUserModal(true);
  };

  const openEditBook = (book) => {
    setSelectedBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      description: book.description,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      coverImage: book.coverImage,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
    });
    setShowEditBookModal(true);
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-title">GyanKosh Admin Panel</h1>
          <p className="admin-welcome">
            Welcome back,
            {storedUser?.fullName ? storedUser.fullName.split(" ")[0] : "Admin"}
            !
          </p>
        </div>

        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <div className="nav-tabs">
          {[
            { id: "overview", label: "📊 Overview", icon: "📊" },
            { id: "users", label: "👥 Users", icon: "👥" },
            { id: "books", label: "📚 Books", icon: "📚" },
            { id: "burrowing", label: "📖 Burrowing", icon: "📖" },
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
      <main className="admin-main">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="section-title">Library Statistics</h2>

            {/* Statistics Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon">📚</div>
                  <div>
                    <div className="stat-value blue">{count}</div>
                    <div className="stat-label">Total Books</div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon">👥</div>
                  <div>
                    <div className="stat-value green">
                      {totalUsers}

                      {/* {total users in db} */}
                    </div>
                    <div className="stat-label">Active Users</div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon">📖</div>
                  <div>
                    <div className="stat-value yellow">
                      {burrowedBooksCount}
                    </div>
                    <div className="stat-label">Books Burrowed</div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon">⚠️</div>
                  <div>
                    <div className="stat-value red">{overdueBooksCount}</div>
                    <div className="stat-label">Overdue Books</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Chart */}
            <div className="category-section">
              <h3 className="section-subtitle">Books by Category</h3>
              <div className="category-grid">
                {Object.entries(statistics.categoryCounts || {}).map(
                  ([category, count]) => (
                    <div key={category} className="category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{count}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="section-header">
              <h2 className="section-title">
                User Management ({users.length} users)
              </h2>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="add-button"
              >
                ➕ Add New User
              </button>
            </div>

            {/* Users Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>No. of Burrowed Books</th>
                    <th>Join Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div>
                          <div className="user-name">{user.fullName}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`role-badge ${
                            user.role === "admin" ? "admin" : "user"
                          }`}
                        >
                          {user.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td>
                        <span className="borrowed-count">
                          {user.currentBurrows ?? 0}
                        </span>
                      </td>
                      <td>
                        <span className="date-text">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="action-buttons">
                          <button
                            onClick={() => openEditUser(user)}
                            className="edit-button"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={user._id === storedUser?._id}
                            className={`delete-button ${
                              user._id === storedUser?._id ? "disabled" : ""
                            }`}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === "books" && (
          <div>
            <div className="section-header">
              <h2 className="section-title">
                Book Management ({books.length} books)
              </h2>

              <button
                onClick={() => setShowAddBookModal(true)}
                className="add-button"
              >
                ➕ Add New Book
              </button>
            </div>

            {/* Books Grid */}
            <div className="books-grid">
              {books.map((book) => (
                <div key={book.id} className="book-card">
                  {/* Book cover */}
                  <div
                    className="book-cover"
                   
                  >
                    <div className="book-icon">📖</div>
                    <div
                      className={`availability-badge ${
                        book.availableCopies > 0 ? "available" : "unavailable"
                      }`}
                    >
                      {book.availableCopies}/{book.totalCopies} Available
                    </div>
                  </div>

                  {/* Book details */}
                  <div className="book-details">
                    <div className="book-category">{book.category}</div>

                    <h3 className="book-title">{book.title}</h3>

                    <p className="book-author">by {book.author}</p>

                    {/* <div className="book-meta">
                      <div className="book-rating">
                        <span className="star-icon">⭐</span>
                        <span>{book.rating}</span>
                      </div>
                      <div className="book-pages">{book.pages} pages</div>
                    </div> */}

                    {/* Action buttons */}
                    <div className="book-actions">
                      <button
                        onClick={() => openEditBook(book)}
                        className="edit-book-button"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book)}
                        className="delete-book-button"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Borrowing Tab */}
        {activeTab === "burrowing" && (
          <div>
            <h2 className="section-title">
              Burrowing History ({burrowRecords.length} records)
            </h2>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Burrow Date</th>
                    <th>Due Date</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {burrowRecords.map((record) => {
                    const user = record.user;
                    const book = record.book;
                    const isOverdue =
                      record.status === "burrowed" &&
                      new Date() > record.dueDate;

                    return (
                      <tr key={record._id}>
                        <td>
                          <div>
                            <div className="user-name">
                              {user ? user.fullName : "Unknown User"}
                            </div>
                            <div className="user-email">{user?.email}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="user-name">
                              {book?.title || "Unknown Book"}
                            </div>
                            <div className="user-email">by {book?.author}</div>
                          </div>
                        </td>
                        <td>
                          <span className="date-text">
                            {new Date(record.burrowDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`date-text ${
                              isOverdue ? "overdue" : ""
                            }`}
                          >
                            {new Date(record.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`status-badge ${
                              record.status === "returned"
                                ? "returned"
                                : isOverdue
                                ? "overdue"
                                : "burrowed"
                            }`}
                          >
                            {record.status === "returned"
                              ? "✅ Returned"
                              : isOverdue
                              ? "⚠️ Overdue"
                              : "📖 Burrowed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New User</h3>

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={userForm.fullName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, fullName: e.target.value })
                  }
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    resetUserForm();
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add New Book</h3>

            <form onSubmit={handleAddBook}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title </label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, author: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category </label>
                  <input
                    type="text"
                    value={bookForm.category}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, isbn: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Published Year</label>
                  <input
                    type="number"
                    value={bookForm.publishedYear}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        publishedYear: parseInt(e.target.value),
                      })
                    }
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
               
                <div className="form-group">
                  <label>Total Copies</label>
                  <input
                    type="number"
                    value={bookForm.totalCopies}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        totalCopies: parseInt(e.target.value),
                        availableCopies: parseInt(e.target.value), 
                      })
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={bookForm.publisher}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, publisher: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Cover Image (URL) </label>
                <input
                  type="text"
                  value={bookForm.tags}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, tags: e.target.value })
                  }
                  placeholder="Enter the valid Cover Image Url"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBookModal(false);
                    resetBookForm();
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Edit User: {selectedUser.fullName}</h3>

            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label>Full Name </label>
                <input
                  type="text"
                  value={userForm.fullName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, fullName: e.target.value })
                  }
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value })
                  }
                  disabled={selectedUser.id === storedUser?.id}
                  className={
                    selectedUser.id === storedUser?.id ? "disabled" : ""
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setSelectedUser(null);
                    resetUserForm();
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditBookModal && selectedBook && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Edit Book: {selectedBook.title}</h3>

            <form onSubmit={handleEditBook}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title </label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, author: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category </label>
                  <input
                    type="text"
                    value={bookForm.category}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, isbn: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Published Year</label>
                  <input
                    type="number"
                    value={bookForm.publishedYear}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        publishedYear: parseInt(e.target.value),
                      })
                    }
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="form-group">
                  <label>Total Copies</label>
                  <input
                    type="number"
                    value={bookForm.totalCopies}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        totalCopies: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    value={bookForm.publisher}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, publisher: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditBookModal(false);
                    setSelectedBook(null);
                    resetBookForm();
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

// backend route and controller are yet to be defined for event handling :
