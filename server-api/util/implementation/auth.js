import * as authRepo from "../repository/auth.repository.js";

function createUser({ user }) {
    return new Promise((resolve, reject) => {
        try {
            if (!user) {
                reject("User is required");
            }
            user.createdDate = new Date(new Date().toUTCString());
            user.modifiedDate = new Date(new Date().toUTCString());
            user.statusId = 1;

            authRepo
                .createUser({ user: user })
                .then((newUser) => {
                    resolve(newUser);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

function getUserByAuthUid({ authId }) {
    return new Promise((resolve, reject) => {
        try {
            authRepo
                .getUserByAuthUid({ authId: authId })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

function getUserByUid({ uid }) {
    return new Promise((resolve, reject) => {
        try {
            authRepo
                .getUserByUid({ uid: uid })
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export { createUser, getUserByAuthUid, getUserByUid };
