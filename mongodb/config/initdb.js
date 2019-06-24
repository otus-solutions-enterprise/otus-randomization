db = db.getSiblingDB('admin');

db.createUser({
    user: "admin",
    pwd: "XRYs9yjU",
    roles: [{
        role: "root",
        db: "admin"
    }]
});
db.auth("admin", "XRYs9yjU");

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