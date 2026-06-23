import ProjectForm from "../../components/ProjectForm";

export default function CreateProjectPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Create Project
      </h1>

      <ProjectForm />
    </div>
  );
}