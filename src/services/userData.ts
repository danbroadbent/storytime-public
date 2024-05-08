import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Character, NewCharacter } from "../models/prompt";
import { emptyUser, User } from "../models/user";
import { firestore } from "./firebase";

export const checkUsernameAvailable = async (value: string) => {
  const username = value.toLowerCase();
  const usersRef = collection(firestore, "users");

  const usernameQuery = query(usersRef, where("username", "==", username));
  const usernameSnapshot = await getDocs(usernameQuery);

  return usernameSnapshot.empty;
};

export const createUser = (userId: string, username: string, email: string) => {
  const userData = {
    username: username.toLowerCase(),
  };

  setDoc(doc(firestore, "users", userId), userData);
  setDoc(doc(firestore, "users/privateData", userId), { email });
};

export const getUser = async (userId: string) => {
  const userRef = doc(firestore, "users", userId);
  const userSnap = await getDoc(userRef);

  let user = emptyUser;
  if (userSnap.exists()) {
    user = {
      id: userSnap.id,
      ...userSnap.data(),
    } as User;
  }
  return user;
};

export const createCharacter = async (
  currentUserId: string,
  character: NewCharacter
) => {
  const userCharactersCollection = collection(
    firestore,
    `users/${currentUserId}/characters`
  );
  const res = await addDoc(userCharactersCollection, character);
  return res.id;
};

export const getCharactersUpdates = (
  currentUserId: string,
  setSavedCharacters: (characters: Character[]) => void
) => {
  const charactersRef = collection(
    firestore,
    `users/${currentUserId}/characters`
  );
  const q = query(charactersRef, orderBy("name", "desc"));
  return onSnapshot(q, (snapshot) => {
    const characters: Character[] = [];
    snapshot.forEach((doc) => {
      characters.push({
        id: doc.id,
        ...doc.data(),
      } as Character);
    });
    setSavedCharacters(characters);
  });
};

export const updateCharacter = async (
  currentUserId: string,
  character: Character
) => {
  const userCharacterDoc = doc(
    firestore,
    `users/${currentUserId}/characters/${character.id}`
  );
  await setDoc(userCharacterDoc, character);
};

export const deleteCharacter = async (
  currentUserId: string,
  characterId: string
) => {
  const userCharacterDoc = doc(
    firestore,
    `users/${currentUserId}/characters/${characterId}`
  );
  await deleteDoc(userCharacterDoc);
};
