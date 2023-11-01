import Board from "./Board";

export default function ProjectsList({ allProjects, allUsers }) {
  return (
    <>
      <Board allProjects={allProjects} allUsers={allUsers} />
    </>
  );
}
