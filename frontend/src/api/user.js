//users.js
import httpAuth from "./httpAuth";

export const usersApi = {
  // GET /users
  getAll: () => httpAuth.get("/users"),

  // GET /users/{id}
  getById: (id) => httpAuth.get(`/users/${id}`),

  // POST /users
  create: (payload) => httpAuth.post("/users", payload),

  // PUT /users/{id}
  update: (id, payload) => httpAuth.put(`/users/${id}`, payload),

  // DELETE /users/{id}
  delete: (id) => httpAuth.delete(`/users/${id}`),
};