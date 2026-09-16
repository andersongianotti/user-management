import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    // Carregar usuários do localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
    
    // Selecionar o último usuário cadastrado por padrão
    if (storedUsers.length > 0) {
      setSelectedUser(storedUsers[storedUsers.length - 1]);
      setEditFormData(storedUsers[storedUsers.length - 1]);
    }
  }, []);

  const handleUserSelect = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setEditFormData(user);
    setEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...editFormData } : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(editFormData);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFormData(selectedUser);
    setEditing(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUsers.length > 0 ? updatedUsers[updatedUsers.length - 1] : null);
        setEditFormData(updatedUsers.length > 0 ? updatedUsers[updatedUsers.length - 1] : {});
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h5 className="card-title mb-0">Usuários Cadastrados</h5>
            </div>
            <div className="card-body p-0">
              {users.length === 0 ? (
                <div className="p-3 text-center text-muted">
                  Nenhum usuário cadastrado
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {users.map(user => (
                    <button
                      key={user.id}
                      className={`list-group-item list-group-item-action ${
                        selectedUser && selectedUser.id === user.id ? 'active' : ''
                      }`}
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{user.name}</h6>
                        <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                      </div>
                      <small className="text-muted">{user.email}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedUser ? (
            <div className="card shadow">
              <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Perfil do Usuário</h5>
                {!editing && (
                  <button
                    className="btn btn-sm btn-light"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </button>
                )}
              </div>
              <div className="card-body">
                {editing ? (
                  <form>
                    <div className="mb-3">
                      <label htmlFor="editName" className="form-label">Nome Completo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editName"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="editEmail" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="editEmail"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="editPhone" className="form-label">Telefone</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="editPhone"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="editAddress" className="form-label">Endereço</label>
                      <textarea
                        className="form-control"
                        id="editAddress"
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleEditChange}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSaveEdit}
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="text-center mb-4">
                      <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                      <h4>{selectedUser.name}</h4>
                      <p className="text-muted">{selectedUser.email}</p>
                    </div>

                    <hr />

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <strong>Telefone:</strong>
                        <p className="mb-0">{selectedUser.phone}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Data de Cadastro:</strong>
                        <p className="mb-0">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>Endereço:</strong>
                      <p className="mb-0">{selectedUser.address}</p>
                    </div>

                    <div className="mt-4">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(selectedUser.id)}
                      >
                        Excluir Usuário
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <h5 className="text-muted">Selecione um usuário para ver o perfil</h5>
                <p className="text-muted">Ou cadastre um novo usuário na página de cadastro</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
