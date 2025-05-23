import dotenv from "dotenv";

dotenv.config();

const {
    ENVIRONMENT,
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    // FIREBASE_MEASUREMENT_ID,
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
    universe_domain,
} = process.env;

export default {
    environment: ENVIRONMENT,
    firebaseConfig: {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
        // measurementId: FIREBASE_MEASUREMENT_ID,
    },
    serviceAcc: {
        type: type,
        project_id: project_id,
        private_key_id: private_key_id,
        private_key: private_key.replace(/\\n/g, "\n"),
        client_email: client_email,
        client_id: client_id,
        auth_uri: auth_uri,
        token_uri: token_uri,
        auth_provider_x509_cert_url: auth_provider_x509_cert_url,
        client_x509_cert_url: client_x509_cert_url,
        universe_domain: universe_domain,
    },
};
