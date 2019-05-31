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

