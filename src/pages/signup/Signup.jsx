import { useState } from "react";
import "./Signup.css";
import { useSignup } from "./../../hooks/useSignup";

export default function Singup() {
  const { signup, error, isLoading } = useSignup();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [baseImg, setBaseImg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, baseImg);
  };

  const handleImage = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];
    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }
    setThumbnailError(null);
    setThumbnail(selected);
    fileToBase(selected);
  };

  const fileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBaseImg(reader.result);
    };
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>email:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>display name:</span>
        <input
          required
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <span>profile thumbnail:</span>
        <input required type="file" onChange={handleImage} />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      <button className="btn">Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
