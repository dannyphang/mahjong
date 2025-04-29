import * as db from "../../firebase/firebase-admin.js";

const userCollectionName = "user";

function createUser({ user }) {
    return new Promise(async (resolve, reject) => {
        try {
            let newRef = db.default.db.collection(userCollectionName).doc();
            user.uid = newRef.id;

            await newRef.set(user);

            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

function getUserByAuthUid({ authId }) {
    return new Promise(async (resolve, reject) => {
        try {
            const snapshot = await db.default.db.collection(userCollectionName).where("authUid", "==", authId).where("statusId", "==", 1).get();

            if (snapshot.empty) {
                reject("User not found");
            } else {
                let user = snapshot.docs[0].data();
                user.uid = snapshot.docs[0].id;
                resolve(user);
            }
        } catch (error) {
            reject(error);
        }
    });
}

function getUserByUid({ uid }) {
    return new Promise(async (resolve, reject) => {
        try {
            const snapshot = await db.default.db.collection(userCollectionName).doc(uid).get();

            if (!snapshot.exists) {
                resolve(null);
            } else {
                let user = snapshot.data();
                user.uid = snapshot.id;
                resolve(user);
            }
        } catch (error) {
            reject(error);
        }
    });
}
function updateUser({ user }) {
    return new Promise(async (resolve, reject) => {
        try {
            const snapshot = await db.default.db.collection(userCollectionName).doc(user.uid).update(user);

            resolve(snapshot);
        } catch (error) {
            reject(error);
        }
    });
}

export { createUser, getUserByAuthUid, getUserByUid, updateUser };
