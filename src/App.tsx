import React, { useState, useEffect } from 'react';
import { Autocomplete } from './Autocomplete'; // Zakładam, że plik jest w tym samym folderze
import './App.css'; // Zakładam, że masz plik CSS do stylizacji

interface User {
  id: number;
  name: string;
  email: string;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobieranie danych z API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleSelect = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemove = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  const handleCreate = (name: string) => {
    const newUser: User = {
      id: Date.now(), // Symulacja ID
      name: name,
      email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
    };
    setUsers([...users, newUser]);
    setSelectedUsers([...selectedUsers, newUser]);
  };

  if (loading) return <div>Ładowanie danych...</div>;

  return (
    <div style={{ padding: '50px' }}>
      <h1>Wyszukaj i wybierz użytkownika</h1>
      <Autocomplete
        options={users}
        selected={selectedUsers}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onCreate={handleCreate}
        getLabel={(u) => u.name}
        placeholder="Wpisz imię użytkownika..."
      />
      
      
    </div>
  );
}