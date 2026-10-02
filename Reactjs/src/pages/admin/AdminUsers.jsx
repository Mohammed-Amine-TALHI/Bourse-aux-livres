import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import http, { errorMessage } from "../../api/http";
import { Badge, EmptyState, ErrorState, Loader, useTitle } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { formatDate, initials } from "../../utils/format";

const AdminUsers = () => {
  useTitle("Users · Admin");
  const { user: me } = useAuth();
  const { data, loading, error, reload, setData } = useFetch("/admin/users");
  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (data?.users || []).filter(
      (user) => !needle || [user.name, user.email, user.phonenumber].some((value) => value?.toLowerCase().includes(needle))
    );
  }, [data, search]);

  const updateRole = async (user, role) => {
    try {
      await http.put(`/admin/users/${user.id}/role`, { role });
      setData((prev) => ({ users: prev.users.map((item) => (item.id === user.id ? { ...item, role } : item)) }));
      toast.success(`${user.name} is now ${role === "admin" ? "an administrator" : "a regular user"}.`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (loading) return <Loader page />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Users</h1>
          <p>Everyone registered on the marketplace. Administrators can review listings.</p>
        </div>
      </div>

      <div className="card">
        <div className="admin-filters">
          <div className="input-icon">
            <i className="bi bi-search" />
            <input
              type="search"
              className="input"
              placeholder="Search a name, an email or a phone number…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: 24 }}>
            <EmptyState icon="bi-search" title="No user found" />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Listings</th>
                  <th>Joined</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="cell-book">
                        <span className="avatar">{initials(user.name)}</span>
                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.phonenumber}</td>
                    <td>{user.books_count}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      {user.id === me.id ? (
                        <Badge tone="accent" plain>
                          Administrator (you)
                        </Badge>
                      ) : (
                        <select
                          className="select select-sm"
                          value={user.role}
                          onChange={(event) => updateRole(user, event.target.value)}
                          aria-label={`Role of ${user.name}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
