import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useComments = () => {
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const createComment = async (comment, projectId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      "https://projects.adaptable.app/api/comment/createComment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment,
          project: projectId,
          createdBy: user.userId,
        }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    console.log(json);
    return json;
  };

  const getComments = async (projectId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      `https://projects.adaptable.app/api/comment/getComments/${projectId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false);
    }
    return json.data.comments;
  };
  return {
    isLoading,
    error,
    createComment,
    getComments,
  };
};
