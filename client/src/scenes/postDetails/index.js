import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import {
  ChatBubbleOutlineOutlined,
//   FavoriteBorderOutlined,
//   FavoriteOutlined,
//   ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  userType,
  location,
  legalDomain,
  picturePath,
  userPicturePath,
  interests,
  comments,
  buttonDisable,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const userId = loggedInUser?.userId;
  const isInterested = Boolean(
    interests.find((user) => userId === user.userId)
  );
  const interestCount = Object.keys(interests).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchInterest = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postId}/interest`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: loggedInUser }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchComment = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: loggedInUser, comment }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment("");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload(); // Or navigate to another page
      } else {
        console.error("Failed to delete the post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0" gap="1rem">
      <Friend
        connectionId={postUserId}
        name={name}
        subtitle={userType}
        userPicturePath={userPicturePath}
      />

      <FlexBetween
        sx={{
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate(`/posts/${postId}`);
          navigate(0);
        }}
      >
        <Typography color={main} sx={{ mt: "1rem", fontSize: "1rem" }}>
          {description}
        </Typography>

        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={`http://localhost:5000/assets/${picturePath}`}
          />
        )}

        <FlexBetween width="100%" mt="0.5rem" fontSize="0.75rem">
          <Typography
            color={primary}
            sx={{ fontSize: "0.75rem", fontWeight: "500" }}
          >
            Location: {location}
          </Typography>
          <Typography
            color={primary}
            sx={{ fontSize: "0.75rem", fontWeight: "500" }}
          >
            Domain: {legalDomain}
          </Typography>
        </FlexBetween>
      </FlexBetween>

      {/* Edit/Delete buttons */}
      {userId === postUserId && (
        <Box display="flex" gap="1rem" mt="1rem">
          <Button
            variant="outlined"
            size="small"
            onClick={() => console.log("Edit feature coming soon")}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem" width="100%">
          <FlexBetween gap="0.5rem">
            <Button
              size="small"
              disabled={isInterested}
              onClick={patchInterest}
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { backgroundColor: palette.primary.dark },
              }}
            >
              Interested
            </Button>
            <Typography>{interestCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton
              disabled={buttonDisable}
              onClick={() => setIsComments(!isComments)}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <TextField
            placeholder="write a comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
            }}
            multiline={true}
          />
          <Button size="small" onClick={patchComment}>
            Post Comment
          </Button>

          {comments.length > 0 &&
            comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <FlexBetween
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    m: "0.5rem 1rem",
                  }}
                >
                  <FlexBetween>
                    <UserImage image={comment.user.picturePath} size="25px" />
                    <Typography sx={{ color: primary, m: "0.25rem" }}>
                      {comment.user.firstName}
                    </Typography>
                  </FlexBetween>

                  <Typography sx={{ color: main, mt: "0.25rem" }}>
                    {comment.comment}
                  </Typography>
                </FlexBetween>
              </Box>
            ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
