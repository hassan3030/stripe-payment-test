"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

type ProviderProps = {
  children: React.ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  const { user, isLoaded } = useUser();
  const hasCreatedCustomer = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasCreatedCustomer.current) return;

    const createCustomer = async () => {
      hasCreatedCustomer.current = true;
      
      try {
        await axios.post("/api/user", {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        });
      } catch (error) {
        console.error("Failed to create customer", error);
        hasCreatedCustomer.current = false;
      }
    };

    createCustomer();
  }, [isLoaded, user]);

  return(
    {children}
  )
 
  
  
}