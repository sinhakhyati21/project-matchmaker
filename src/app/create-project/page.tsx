import ProjectForm from "../../components/ProjectForm";

export default function CreateProjectPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 8,
          }}
        >
          Create a Project
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Describe your idea and we will help you find the perfect teammates.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}