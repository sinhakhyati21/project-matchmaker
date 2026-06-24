import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import Project from "../../models/Project.model";
import Application from "../../models/Application.model";
import ApplicationActions from "../../components/ApplicationActions";
import ProjectStatusActions from "../../components/ProjectStatusActions";
import TeamRecommendations from "../../components/TeamRecommendations";
import DashboardActions from "../../components/DashboardActions";
import MyApplications from "../../components/MyApplications";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  RECRUITING: { bg: "rgba(34,197,94,0.1)", color: "#4ade80" },
  ACTIVE: { bg: "rgba(99,102,241,0.1)", color: "#818cf8" },
  COMPLETED: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24" },
  ARCHIVED: { bg: "rgba(161,161,170,0.1)", color: "#a1a1aa" },
};

const APP_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: "rgba(245,158,11,0.1)", color: "#fbbf24" },
  ACCEPTED: { bg: "rgba(34,197,94,0.1)", color: "#4ade80" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  await connectDB();

  const projects = await Project.find({
    owner: session.user.id,
  }).sort({ createdAt: -1 });

  const applications = await Application.find({
    project: {
      $in: projects.map((project) => project._id),
    },
  })
    .populate("user", "name email githubUsername image skills status")
    .populate("project", "title")
    .sort({ createdAt: -1 });

  const safeProjects = JSON.parse(JSON.stringify(projects));
  const safeApplications = JSON.parse(JSON.stringify(applications));

  const pendingCount = safeApplications.filter(
    (a: any) => a.status === "PENDING"
  ).length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Manage your projects and team applications.
        </p>
      </div>
      <MyApplications />
      {/* Stats Row — subtle, professional */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 40,
        }}
      >
        {[
          {
            label: "My Projects",
            value: safeProjects.length,
          },
          {
            label: "Applications",
            value: safeApplications.length,
          },
          {
            label: "Pending Review",
            value: pendingCount,
          },
          {
            label: "Accepted",
            value: safeApplications.filter(
              (a: any) => a.status === "ACCEPTED"
            ).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 6,
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* My Projects */}
      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            My Projects
          </h2>
          <a
            href="/create-project"
            style={{
              background: "#6366f1",
              color: "white",
              padding: "7px 14px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New Project
          </a>
        </div>

        {safeProjects.length === 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: 12,
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
              No projects yet. Create your first one.
            </p>
            <a
              href="/create-project"
              style={{
                background: "#6366f1",
                color: "white",
                padding: "8px 20px",
                borderRadius: 7,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Create Project
            </a>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {safeProjects.map((project: any) => {
              const status = project.status || "RECRUITING";
              const statusStyle =
                STATUS_COLORS[status] || STATUS_COLORS.RECRUITING;
              const memberCount = (project.members?.length || 0) + 1;
              const progressPct = Math.round(
                (memberCount / project.maxTeamSize) * 100
              );

              return (
                <div
                  key={project._id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {/* Project Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        flex: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        marginLeft: 8,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Team Progress */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{ fontSize: 11, color: "var(--text-muted)" }}
                      >
                        Team
                      </span>
                      <span
                        style={{ fontSize: 11, color: "var(--text-muted)" }}
                      >
                        {memberCount}/{project.maxTeamSize}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "var(--border)",
                        borderRadius: 9999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progressPct}%`,
                          background: "#6366f1",
                          borderRadius: 9999,
                        }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      background: "var(--border)",
                    }}
                  />

                  <ProjectStatusActions
                    projectId={project._id}
                    currentStatus={status}
                  />

                  <TeamRecommendations projectId={project._id} />

                  <DashboardActions
                    projectId={project._id}
                    projectStatus={status}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Applications Received */}
      <section>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          Applications Received
        </h2>

        {safeApplications.length === 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: 12,
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              No applications received yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {safeApplications.map((application: any) => {
              const appStatus = application.status || "PENDING";
              const appStatusStyle =
                APP_STATUS_COLORS[appStatus] || APP_STATUS_COLORS.PENDING;

              return (
                <div
                  key={application._id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {application.user?.image && (
                      <img
                        src={application.user.image}
                        alt={application.user.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: "1px solid var(--border)",
                        }}
                      />
                    )}
                    <div>
                      <h3
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "var(--text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        {application.user?.name || "Unknown User"}
                      </h3>
                      <p
                        style={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        @{application.user?.githubUsername || "github"} ·{" "}
                        {application.project?.title}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginTop: 5,
                        }}
                      >
                        {application.user?.skills
                          ?.slice(0, 4)
                          .map((skill: string) => (
                            <span
                              key={skill}
                              style={{
                                background: "rgba(99,102,241,0.08)",
                                color: "#818cf8",
                                border: "1px solid rgba(99,102,241,0.15)",
                                padding: "1px 7px",
                                borderRadius: 4,
                                fontSize: 11,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        background: appStatusStyle.bg,
                        color: appStatusStyle.color,
                        padding: "3px 10px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {appStatus}
                    </span>
                    <ApplicationActions
                      applicationId={application._id}
                      status={application.status}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}