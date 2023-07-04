import React, { createContext, useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../components/firebase";


export const AuthContext = createContext(undefined);

export const AuthContextProvider = (props) => {
    const [user, setUser] = useState();
    const [update, setUpdate] = useState(false);
    const [userData,setUserData]= useState();


    useEffect(() => {
        fcl.currentUser().subscribe(setUser);
    }, [])

    const login = () => {
        fcl.authenticate();
    }

    useEffect(()=>{
        if(user?.addr){
            getFirestoreData()
        } 
    },[user,update])

    const getFirestoreData = async () => { 
        const q = query(collection(db, "Users"), where("Address", "==", user?.addr));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((fire) => {
              const id = fire.id;
              setUserData({...fire.data(), id});
        });
      };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                update,
                setUpdate,
                userData,
                getFirestoreData
            }}
            {...props}
        >
            {props.children}
        </AuthContext.Provider>
    );
}