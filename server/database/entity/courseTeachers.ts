import { int, mysqlTable, date } from "drizzle-orm/mysql-core";
import { Courses } from "./course";
import { Teachers } from "./teacher";

export const CourseTeachers = mysqlTable(
  "course_teachers",
  {
    id: int().autoincrement().primaryKey(),
    courseID: int("courseID")
      .notNull()
      .references(() => Courses.id, { onDelete: "cascade" }),
    teacherID: int("teacherID")
      .notNull()
      .references(() => Teachers.id, { onDelete: "cascade" }),
        createdAt: date().default(new Date()),
  }
);