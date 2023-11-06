import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useComments } from "../../hooks/useComments";
import Avatar from "../../components/Avatar";

import formatDistanceToNow from "date-fns/formatDistanceToNow";

const { io } = require("socket.io-client");

export default function ProjectComments({ projectId }) {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const { createComment, getComments } = useComments();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const socketConnection = io("https://projects.adaptable.app");
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(socket.id);
        console.log("socket is connected");
      });

      socket.emit("set user online", user.userId);
      socket.emit("join project", projectId);
      socket.on("receive message", (newChat) => {
        // setComments([...comments, newChat]);
        setComments((prevComments) => [...prevComments, newChat]);
      });
    }
  }, [socket, user]);

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getComments(projectId);

      setComments(comments);
    };
    fetchComments();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await createComment(newComment, projectId);
    console.log(response);
    if (!response.error) {
      const createdComment = response.data.commentCreated;
      const newCommented = {
        _id: createdComment._id,
        createdAt: createdComment.createdAt,
        createdBy: {
          profileImage: { url: user.profileImageUrl },
          userName: user.userName,
        },
        comment: newComment,
        projectId: createdComment.project,
      };

      socket.emit("new comment", newCommented);
      setComments([...comments, newCommented]);
      setNewComment("");
    }
  };

  return (
    <div className="project-comments">
      <h4>ProjectComments</h4>
      <ul>
        {comments.length > 0 &&
          comments.map((comment) => (
            <li key={comment._id}>
              <div className="comment-author">
                <Avatar src={comment.createdBy.profileImage.url} />
                <p>{comment.createdBy.userName}</p>
              </div>
              <div className="comment-date">
                <p>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="comment-content">
                <p>{comment.comment}</p>
              </div>
            </li>
          ))}
      </ul>
      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment :</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
    </div>
  );
}
