import React from "react";
import { Checkbox } from "rsuite";

function CourseCheckList({ items, onSelect }) {
  return (
    items.length > 0 && (
      <div className="course-checklist">
        {items.map(({ id, name, selected }) => (
          <div key={id}>
            <Checkbox checked={selected} onChange={() => onSelect(id)}>
              {name}
            </Checkbox>
          </div>
        ))}
      </div>
    )
  );
}

export default CourseCheckList;
