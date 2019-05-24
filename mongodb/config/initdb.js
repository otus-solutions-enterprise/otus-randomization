db = db.getSiblingDB('admin');

db.createUser({
    user: "admin",
    pwd: "secret",
    roles: [{
        role: "root",
        db: "admin"
    }]
});
db.auth("admin", "secret");

db = db.getSiblingDB('otus-randomization');
db.createUser({
    user: "otus",
    pwd: "teste123",
    roles: [{
        role: "dbOwner",
        db: "otus"
    }]
});

db.createCollection("table-randomization");

