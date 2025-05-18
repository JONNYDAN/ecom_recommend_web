import React, { useState } from "react";
import { Button, PanelGroup, Panel, Placeholder, Stack, Divider } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import CourseCheckList from "./CourseCheckList";

const mockChecklist = [
  {
    id: 123,
    name: "AWS associate",
    selected: false,
  },
  {
    id: 124,
    name: "AWS professional",
    selected: false,
  },
  {
    id: 125,
    name: "AWS ABC",
    selected: false,
  },
  {
    id: 126,
    name: "AWS XYZ",
    selected: false,
  },
  {
    id: 1231,
    name: "AWS associate",
    selected: false,
  },
  {
    id: 1242,
    name: "AWS professional",
    selected: false,
  },
  {
    id: 1253,
    name: "AWS ABC",
    selected: false,
  },
  {
    id: 1264,
    name: "AWS XYZ",
    selected: false,
  },
];

function CourseFilter() {
  const [courseList, setCouseList] = useState(mockChecklist);

  const selectCourse = (id) => {
    const newCourseList = courseList.map((course) => {
      if (course.id === id) {
        return { ...course, selected: !course.selected };
      }

      return course;
    });
    setCouseList(newCourseList);
  };

  return (
    <div className="mt-3">
      <PanelGroup accordion shaded className="shadow-sm">
        <Stack
          justifyContent="space-between"
          alignItems="center"
          className="ps-3 pe-2 pt-3"
        >
          <span>Filter</span>
          <Button size="xs" endIcon={<CloseIcon />}>
            Clear
          </Button>
        </Stack>
        <Divider className="mt-2 mb-0" />
        <Panel header="AWS" defaultExpanded>
          <CourseCheckList items={courseList} onSelect={selectCourse} />
        </Panel>
        <Panel header="Azure">
          <Placeholder.Paragraph />
        </Panel>
        <Panel header="Google clouds">
          <Placeholder.Paragraph />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default CourseFilter;
