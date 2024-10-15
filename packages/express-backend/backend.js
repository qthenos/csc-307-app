// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

const makeid = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890'
    const charactersLength = characters.length;
    const numbersLength = numbers.length;
    let counter = 0;
    while (counter < length) {
        if (counter < length / 2) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        } else {
            result += numbers.charAt(Math.floor(Math.random() * numbersLength));
        }
        counter += 1;
    }
    return result;
}

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
    user['id'] = makeid(6);
    users["users_list"].push(user);
    return user;
};

const deleteUserByID = (id) => {
    for (var i = 0; i < users["users_list"].length; i++) {
        if (users["users_list"][i].id === id) {
            return users["users_list"].splice(i, 1);
        }
    }
};

const findUserByNameAndJob = (name, job) => {
    var fits = []
    for (var i = 0; i < users["users_list"].length; i++) {
        if (users["users_list"][i].name === name && users["users_list"][i].job === job) {
            fits.push(users["users_list"][i])
        }
    }
    return fits;
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.params.job;
    if (name != undefined) {
        if (job != undefined) {
            let result = findUserByNameAndJob(name, job);
            if (!result || result.length === 0) {
                res.status(404).send("Resource not found.");
            } else {
                res.send(result);
            }
        } else {
            let result = findUserByName(name);
            if (!result || result.length === 0) {
                res.status(404).send("Resource not found.");
            } else {
                result = { users_list: result };
                res.send(result);
            }
        }
    } else {
        res.send(users);
    }
});

// app.get("/users/:name/:job", (req, res) => {
//     const name = req.params.name;
//     const job = req.params.job;
//     let result = findUserByNameAndJob(name, job);
//     if (!result || result.length === 0) {
//         res.status(404).send("Resource not found.");
//     } else {
//         res.send(result);
//     }
// });

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    let result = deleteUserByID(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.status(204).send();
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
    res.status(201).send(userToAdd);

});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});
