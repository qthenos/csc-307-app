// src/MyApp.jsx

import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
    return promise;
  }

  function deleteUserById(id) {
    const promise = fetch(`${"http://localhost:8000/users/"}${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return promise;
  }

  function removeOneCharacter(index) {
    deleteUserById(characters[index]["id"])
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else {
          console.log(res.status)
        }
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => (res.status === 201 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setCharacters([...characters, json]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
