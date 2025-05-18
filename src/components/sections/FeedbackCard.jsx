import { getAvatarCharacter } from "@/utils/stringUtils";
import React from "react";
import { Avatar, Panel, Rate } from "rsuite";

function FeedbackCard({
  name,
  jobRole,
  rating,
  feedbackTitle,
  feedbackContent,
}) {
  return (
    <Panel
      shaded
      bordered
      bodyFill
      style={{ width: 320 }}
      className="feedback-card-container bg-white p-4"
    >
      <p className="text-muted fw-500">{feedbackTitle}</p>
      <div className="review-content mb-3 scrollbar-thin">
        <small>{feedbackContent}</small>
      </div>

      <div className="d-flex align-items-center gap-3">
        <Avatar circle style={{ background: "#000" }}>
          {getAvatarCharacter(name)}
        </Avatar>
        <div className="d-flex flex-column">
          <span className="fw-500 text-muted">{name}</span>
          <Rate value={rating} readOnly size="xs" color="yellow" />
        </div>
      </div>
    </Panel>
  );
}

export default FeedbackCard;
