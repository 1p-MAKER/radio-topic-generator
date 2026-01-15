import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import type { GeneratedTopic } from "./gemini";

// Config will be populated by environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
// Note: This will throw if config is missing in production, but we'll catch errors in usage
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface SavedTopic extends GeneratedTopic {
    id: string;
    createdAt: any;
}

export const saveTopicToFirestore = async (topic: GeneratedTopic) => {
    try {
        await addDoc(collection(db, "topics"), {
            ...topic,
            createdAt: serverTimestamp()
        });
        console.log("Topic saved to Firestore");
        return true;
    } catch (e: any) {
        console.error("Error adding document: ", e);
        if (e.code === 'permission-denied') {
            alert("保存に失敗しました：権限がありません。\nFirebaseコンソールでFirestoreの「ルール」をテストモード（allow write: if true）に変更してください。");
        } else if (e.code === 'unimplemented' || e.message.includes("Cloud Firestore API has not been enabled")) {
            alert("保存に失敗しました：データベースが作成されていません。\nFirebaseコンソールで「Firestore Database」を作成してください。");
        } else {
            alert(`保存に失敗しました。\nエラー: ${e.message}`);
        }
        return false;
    }
};

export const getSavedTopics = async (): Promise<SavedTopic[]> => {
    try {
        const q = query(collection(db, "topics"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SavedTopic));
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

export const deleteSavedTopic = async (id: string) => {
    try {
        await deleteDoc(doc(db, "topics", id));
        return true;
    } catch (e) {
        console.error("Error deleting document: ", e);
        return false;
    }
};
