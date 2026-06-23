type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
};

const columns = [
  { key: "TODO", title: "To Do" },
  { key: "IN_PROGRESS", title: "In Progress" },
  { key: "REVIEW", title: "Review" },
  { key: "DONE", title: "Done" },
] as const;

export default function KanbanBoard({
  tasks,
}: {
  tasks: Task[];
}) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div
          key={column.key}
          className="border rounded-xl p-4 bg-gray-50"
        >
          <h3 className="font-bold mb-4">{column.title}</h3>

          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.key)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white border rounded-lg p-3 shadow-sm"
                >
                  <h4 className="font-semibold">{task.title}</h4>

                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}