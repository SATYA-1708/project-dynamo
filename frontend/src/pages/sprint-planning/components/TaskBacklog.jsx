import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const TaskBacklog = ({
  tasks,
  onTaskSelect,
  onAddToSprint,
  onBulkSelection,
  onBulkEstimation,
  filterOptions,
  sortOption,
  onFilterChange,
  onSortChange,
  epics,
  priorities,
  assignees,
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [estimationPoints, setEstimationPoints] = useState(5);

  const fibonacciPoints = [1, 2, 3, 5, 8, 13, 21];

  const handleToggleExpand = (taskId) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectTask = (taskId, isSelected) => {
    const newSelected = isSelected
      ? [...selectedTasks, taskId]
      : selectedTasks.filter((id) => id !== taskId);
    setSelectedTasks(newSelected);
    onBulkSelection(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    const newSelected = isSelected ? tasks.map((t) => t._id) : [];
    setSelectedTasks(newSelected);
    onBulkSelection(newSelected);
  };

  const handleEstimateSelected = () => setShowEstimationModal(true);

  const handleEstimationSubmit = () => {
    onBulkEstimation(estimationPoints);
    setShowEstimationModal(false);
  };


  return (
    <div>
      {/* Filters & Sort */}
      <div className="p-4 flex flex-wrap gap-3">
        <select
          value={filterOptions.epic}
          onChange={(e) => onFilterChange("epic", e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Epics</option>
          {epics.map((epic) => (
            <option key={epic} value={epic}>{epic}</option>
          ))}
        </select>
        <select
          value={filterOptions.priority}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Priorities</option>
          {priorities.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={filterOptions.assignee}
          onChange={(e) => onFilterChange("assignee", e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm"
        >
          <option value="all">All Assignees</option>
          {assignees.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-border rounded px-2 py-1 text-sm"
        >
          <option value="priority">Sort by Priority</option>
          <option value="points">Sort by Points</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-secondary-50 border-y border-border">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={selectedTasks.length === tasks.length && tasks.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-secondary-300 text-primary"
          />
        </div>
        <div className="col-span-7 text-xs font-medium text-text-secondary">Task</div>
        <div className="col-span-2 text-xs font-medium text-text-secondary">Assignee</div>
        <div className="col-span-2 text-xs font-medium text-text-secondary">Actions</div>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">No tasks found</div>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const isExpanded = expandedTasks.includes(task._id);
            const isSelected = selectedTasks.includes(task._id);
            return (
              <div key={task._id} className={`transition ${isSelected ? "bg-primary-50" : ""}`}>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectTask(task._id, e.target.checked)}
                    />
                  </div>
                  <div className="col-span-7">
                    <div className="flex space-x-2">
                      <button onClick={() => handleToggleExpand(task._id)}>
                        <Icon name={isExpanded ? "ChevronDown" : "ChevronRight"} size={14} />
                      </button>
                      <div>
                        <h4
                          onClick={() => onTaskSelect(task._id)}
                          className="text-sm font-medium cursor-pointer hover:text-primary"
                        >
                          {task.taskName}
                        </h4>
                        <div className="flex space-x-2 mt-1">
                          <span className="text-xs text-secondary">{task.projectName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.priority === "High" ? "bg-error-100 text-error-700"
                            : task.priority === "Medium" ? "bg-warning-100 text-warning-700"
                            : "bg-secondary-100 text-secondary-700"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm">{task.assignedTo || "Unassigned"}</div>
                  <div className="col-span-2">
                    <button
                      onClick={() => onAddToSprint(task._id)}
                      className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                    >
                      Add to Sprint
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-6 py-4 bg-secondary-50 border-t">
                    <p className="text-sm text-text-secondary">{task.taskDescription}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk actions */}
      {selectedTasks.length > 0 && (
        <div className="sticky bottom-0 bg-surface border-t p-4 flex justify-between items-center">
          <span className="text-sm text-text-secondary">{selectedTasks.length} selected</span>
          <div className="flex space-x-2">
            <button
              onClick={handleEstimateSelected}
              className="px-3 py-1.5 text-sm bg-secondary-100 rounded hover:bg-secondary-200"
            >
              Estimate Points
            </button>
            <button
              onClick={() => selectedTasks.forEach(id => onAddToSprint(id))}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-700"
            >
              Add to Sprint
            </button>
          </div>
        </div>
      )}

      {/* Estimation modal */}
      {showEstimationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg mb-4">Estimate Story Points</h3>
            <input
              type="number"
              value={estimationPoints}
              onChange={(e) => setEstimationPoints(Number(e.target.value))}
              className="border px-2 py-1 mb-4 w-full"
            />
            <div className="flex gap-2 mb-4">
              {fibonacciPoints.map((point) => (
                <button
                  key={point}
                  onClick={() => setEstimationPoints(point)}
                  className={`px-2 py-1 rounded ${estimationPoints === point ? "bg-primary text-white" : "bg-secondary-100"}`}
                >
                  {point}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEstimationModal(false)}>Cancel</button>
              <button
                onClick={handleEstimationSubmit}
                className="bg-primary text-white px-3 py-1 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBacklog;
