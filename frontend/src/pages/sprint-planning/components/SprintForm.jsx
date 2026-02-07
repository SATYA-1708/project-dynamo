import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";

const SprintForm = ({ sprint, onUpdate, onRemoveTask, onStartSprint }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: sprint?.name,
    startDate: sprint?.startDate ? new Date(sprint.startDate).toISOString().split("T")[0] : "",
    endDate: sprint?.endDate ? new Date(sprint.endDate).toISOString().split("T")[0] : "",
    goal: sprint?.sprintGoal || "",
  });

  useEffect(() => {
    setFormData({
      name: sprint?.name || "",
      startDate: sprint?.startDate ? new Date(sprint.startDate).toISOString().split("T")[0] : "",
      endDate: sprint?.endDate ? new Date(sprint.endDate).toISOString().split("T")[0] : "",
      goal: sprint?.sprintGoal || "",
    });
  }, [sprint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...sprint,
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      goal: formData.goal,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: sprint?.name || "",
      startDate: sprint?.startDate ? new Date(sprint.startDate).toISOString().split("T")[0] : "",
      endDate: sprint?.endDate ? new Date(sprint.endDate).toISOString().split("T")[0] : "",
      goal: sprint?.sprintGoal || "",
    });
    setIsEditing(false);
  };

  const startDate = sprint?.startDate ? new Date(sprint.startDate) : null;
  const endDate = sprint?.endDate ? new Date(sprint.endDate) : null;
  const durationInDays =
    startDate && endDate ? Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-text-primary">Sprint Details</h2>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200"
        >
          <Icon name={isEditing ? "X" : "Edit"} size={18} />
        </button>
      </div>

      {/* Edit mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Sprint Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Sprint Goal</label>
            <textarea
              name="goal"
              rows={3}
              value={formData.goal}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // View mode
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Sprint Name</h3>
            <p className="text-text-primary">{sprint?.name || "—"}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Duration</h3>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} color="#64748B" />
                <p className="text-text-primary">{durationInDays} days</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-1">Dates</h3>
              <p className="text-text-primary">
                {startDate?.toLocaleDateString() || "—"} – {endDate?.toLocaleDateString() || "—"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-1">Sprint Goal</h3>
            <p className="text-text-primary">{sprint?.sprintGoal || "—"}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={onStartSprint}
              disabled={sprint?.isStarted}
              className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${sprint?.isStarted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
            >
              <Icon name="Play" size={16} />
              <span>{sprint?.isStarted ? 'Sprint Started' : 'Start Sprint'}</span>
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Sprint Tasks</h3>
            {sprint?.tasks?.length > 0 ? (
              <ul className="space-y-3">
                {sprint.tasks.map((task) => (
                  <li key={task._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-text-primary">{task.taskName}</p>
                      <button
                        onClick={() => onRemoveTask(task._id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Remove Task"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.status === "To Do"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "Sprint"
                            ? "bg-purple-100 text-purple-800" // New style for 'Sprint' status
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      Assigned to:{" "}
                      {task.assignedTo?.username
                        ? `${task.assignedTo.username} (${task.assignedTo.email})`
                        : task.assignedTo || "Unassigned"}
                    </p>
                    {task.dueDate && (
                      <p className="text-sm text-text-secondary mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary">No tasks in this sprint yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintForm;
