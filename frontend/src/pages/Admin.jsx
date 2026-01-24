import { useEffect, useState } from "react";
import { usersApi } from "../api/users";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

/* ================= STYLES ================= */
const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 4px 18px rgba(15,23,42,0.06)",
  width: "100%",
};

const badgeStyle = {
  padding: "4px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  fontSize: 12,
  fontWeight: 600,
  color: "#0f172a",
};

const btnBase = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  cursor: "pointer",
  fontSize: 13,
};

/* ================= MODAL COMPONENT ================= */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px 32px",
          borderRadius: 16,
          width: "90%",
          maxWidth: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 20px", fontSize: 20, color: "#0f172a" }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Confirm delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await usersApi.getAll();
      const mappedUsers = res.data.result.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.roles?.[0] || "USER",
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error("Fetch users error:", err);
      alert("Không thể tải danh sách user");
    } finally {
      setLoadingUsers(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setForm({ username: "", email: "", password: "" });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setForm({ username: user.username, email: user.email, password: "" });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || (!form.password && modalMode === "add")) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setModalLoading(true);
    try {
      if (modalMode === "add") {
        await usersApi.create({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        setNotification("Thêm user thành công");
      } else {
        await usersApi.update(selectedUser.id, {
          username: form.username,
          email: form.email,
        });
        setNotification("Sửa user thành công");
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await usersApi.delete(userToDelete.id);
      setNotification("Xoá user thành công");
      setDeleteModalOpen(false);
      await fetchUsers();
    } catch (err) {
      alert("Xoá user thất bại");
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      window.location.href = "/"; // Quay về trang login
    }
  };

  return (
    <>
      {/* ================= MAIN CONTENT ================= */}
      <div
        style={{
          width: "100%",
          margin: "24px 0",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: "#64748b", fontWeight: 600 }}>Admin Panel</p>
            <h1 style={{ fontSize: 28, color: "#0f172a", margin: "8px 0" }}>
              Quản lý người dùng
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#b91c1c")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#dc2626")}
          >
            Log out
          </button>
        </header>

        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ fontSize: 18, color: "#0f172a" }}>Danh sách Users</h2>
            <button
              onClick={openAddModal}
              style={{
                ...btnBase,
                background: "#0f4b78",
                color: "#ffffff",
                borderColor: "#0f4b78",
                fontWeight: 600,
              }}
            >
              Thêm user
            </button>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ color: "#6b7280", fontSize: 13, textAlign: "left" }}>
                <th style={{ padding: "12px 10px", borderBottom: "1px solid #e5e7eb", width: "25%" }}>
                  Username
                </th>
                <th style={{ padding: "12px 10px", borderBottom: "1px solid #e5e7eb", width: "35%" }}>
                  Email
                </th>
                <th style={{ padding: "12px 10px", borderBottom: "1px solid #e5e7eb", width: "15%", textAlign: "center" }}>
                  Role
                </th>
                <th style={{ padding: "12px 10px", borderBottom: "1px solid #e5e7eb", width: "25%", textAlign: "center" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={4} style={{ padding: 32, textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 32, textAlign: "center" }}>
                    Chưa có user nào
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.username}
                    </td>
                    <td style={{ padding: "12px 10px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "center" }}>
                      <span style={badgeStyle}>{u.role}</span>
                    </td>
                    <td style={{ padding: "12px 10px", display: "flex", gap: 8, justifyContent: "center" }}>
                      <button style={btnBase} onClick={() => openEditModal(u)}>
                        Sửa
                      </button>
                      <button
                        style={{ ...btnBase, background: "#fee2e2", borderColor: "#fecaca", color: "#991b1b" }}
                        onClick={() => openDeleteModal(u)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === "add" ? "Thêm user mới" : "Sửa user"}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          {modalMode === "add" && (
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  fontSize: 14,
                  width: "100%",
                }}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              />
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              onClick={handleSubmit}
              disabled={modalLoading}
              style={{
                flex: 1,
                padding: "10px",
                background: "#0f4b78",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {modalLoading ? "Đang xử lý..." : modalMode === "add" ? "Thêm" : "Lưu"}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                flex: 1,
                padding: "10px",
                background: "#e2e8f0",
                color: "#475569",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Xác nhận xoá"
      >
        <p style={{ margin: "0 0 20px", color: "#475569" }}>
          Bạn có chắc muốn xoá user <strong>{userToDelete?.username}</strong>?
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleDelete}
            disabled={modalLoading}
            style={{
              flex: 1,
              padding: "10px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            {modalLoading ? "Đang xoá..." : "Xoá"}
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            style={{
              flex: 1,
              padding: "10px",
              background: "#e2e8f0",
              color: "#475569",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Huỷ
          </button>
        </div>
      </Modal>

      {/* ================= NOTIFICATION ================= */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#16a34a",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: 8,
            zIndex: 1000,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.4)",
          }}
        >
          {notification}
        </div>
      )}

      {/* ================= CSS ANIMATIONS ================= */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}