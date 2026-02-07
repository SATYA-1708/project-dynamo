import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import CommandPalette from "../../components/ui/CommandPalette";
import PageHeader from "../../components/ui/PageHeader";
import SprintForm from "./components/SprintForm";
import TaskBacklog from "./components/TaskBacklog";
import TaskDetailModal from "../../components/ui/TaskDetailModal";
import { useModal } from "../../context/ModalContext";

const SprintPlanning = () => {
  const navigate = useNavigate();
  const { setIsSprintModalOpen } = useModal();

  const [selectedSprint, setSelectedSprint] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [backlogTasks, setBacklogTasks] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    epic: "all",
    priority: "all",
    assignee: "all",
  });
  const [sortOption, setSortOption] = useState("priority");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sprints, setSprints] = useState([]);

  // ✅ get backend URL from env
  const API_BASE_URL = import.meta.env.VITE_RENDER_BACKEND_URL;

  const enrichSprintTasks = (sprint, backlog) => ({
    ...sprint,
    tasks: (sprint.tasks || [])
      .map((id) => {
        const task = backlog.find((t) => t._id === id);
        return task ? { ...task, status: "Sprint" } : null;
      })
      .filter(Boolean),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintRes, backlogRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/sprints`),
          axios.get(`${API_BASE_URL}/api/projects/tasks/backlog`),
        ]);

        const sprintsData = Array.isArray(sprintRes.data) ? sprintRes.data : [];
        const backlogData = Array.isArray(backlogRes.data) ? backlogRes.data : [];

        setBacklogTasks(backlogData);
        const enrichedSprints = sprintsData.map((s) =>
          enrichSprintTasks(s, backlogData)
        );
        setSprints(enrichedSprints);

        if (enrichedSprints.length > 0) {
          setSelectedSprint(enrichedSprints[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const handleSprintChange = (sprint) => setSelectedSprint(sprint);

  const handleSprintUpdate = (updatedSprint) => {
    setSelectedSprint(updatedSprint);
    setSprints((prev) =>
      prev.map((s) => (s._id === updatedSprint._id ? updatedSprint : s))
    );
  };

  const handleStartSprint = async () => {
    if (!selectedSprint) return;
    try {
      await axios.put(`${API_BASE_URL}/api/sprints/${selectedSprint._id}/start`, {
        isStarted: true,
      });
      setSelectedSprint((prev) => ({ ...prev, isStarted: true }));
    } catch (error) {
      console.error("Error starting sprint:", error);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleAddTaskToSprint = async (taskId) => {
    if (!selectedSprint) return;

    const taskToAdd = backlogTasks.find((t) => t._id === taskId);
    if (!taskToAdd) return;

    try {
      await axios.post(`${API_BASE_URL}/api/sprints/${selectedSprint._id}/tasks`, {
        taskId,
        projectId: taskToAdd.projectId,
      });
      setBacklogTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSelectedSprint((prev) => ({
        ...prev,
        tasks: [...(prev.tasks || []), { ...taskToAdd, status: "Sprint" }],
      }));
    } catch (error) {
      console.error("Error adding task to sprint:", error);
    }
  };

  const handleRemoveTaskFromSprint = async (taskId) => {
    if (!selectedSprint) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/sprints/${selectedSprint._id}/tasks/${taskId}/remove`
      );
      const removedTask = selectedSprint.tasks?.find((t) => t._id === taskId);

      setSelectedSprint((prev) => ({
        ...prev,
        tasks: Array.isArray(prev.tasks)
          ? prev.tasks.filter((t) => t._id !== taskId)
          : [],
      }));

      if (removedTask) {
        setBacklogTasks((prev) => [
          ...prev,
          { ...removedTask, status: "Backlog" },
        ]);
      }
    } catch (error) {
      console.error("Error removing task from sprint:", error);
    }
  };

  const handleBulkSelection = (taskIds) => setSelectedTasks(taskIds);

  const handleBulkEstimation = (points) => {
    setBacklogTasks((prev) =>
      prev.map((task) =>
        selectedTasks.includes(task._id)
          ? { ...task, storyPoints: points }
          : task
      )
    );
    setSelectedTasks([]);
  };

  const handleFilterChange = (type, value) =>
    setFilterOptions((prev) => ({ ...prev, [type]: value }));

  const handleSortChange = (option) => setSortOption(option);

  const filteredBacklogTasks = backlogTasks.filter((task) => {
    if (filterOptions.epic !== "all" && task.epic !== filterOptions.epic)
      return false;
    if (
      filterOptions.priority !== "all" &&
      task.priority !== filterOptions.priority
    )
      return false;
    if (
      filterOptions.assignee !== "all" &&
      task.assignee?.id !== parseInt(filterOptions.assignee)
    )
      return false;
    return true;
  });

  const sortedBacklogTasks = [...filteredBacklogTasks].sort((a, b) => {
    switch (sortOption) {
      case "priority":
        return (
          { High: 1, Medium: 2, Low: 3 }[a.priority] -
          { High: 1, Medium: 2, Low: 3 }[b.priority]
        );
      case "points":
        return (b.storyPoints || 0) - (a.storyPoints || 0);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const epics = [...new Set(backlogTasks.map((task) => task.epic))];
  const priorities = [...new Set(backlogTasks.map((task) => task.priority))];
  const assignees = [...new Set(
    backlogTasks.map((task) =>
      task.assignee ? JSON.stringify(task.assignee) : null
    )
  )]
    .filter(Boolean)
    .map(JSON.parse);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />
      <main className="lg:pt-16 lg:pl-60">
        <div className="p-6">
          <PageHeader
            actions={
              <button
                onClick={() => setIsSprintModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <Icon name="Plus" size={18} />
                <span>New Sprint</span>
              </button>
            }
          />

          {selectedSprint && (
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <label className="text-text-secondary">Current Sprint:</label>
                  <select
                    value={selectedSprint._id}
                    onChange={(e) =>
                      handleSprintChange(
                        sprints.find((s) => s._id === e.target.value)
                      )
                    }
                    className="border border-border rounded-lg px-3 py-2"
                  >
                    {sprints.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedSprint.isStarted
                        ? "bg-secondary-100 text-secondary-700"
                        : "bg-primary-100 text-primary-700"
                    }`}
                  >
                    {selectedSprint.isStarted ? "Active" : "Planning"}
                  </span>
                  {!selectedSprint.isStarted && (
                    <button
                      onClick={handleStartSprint}
                      className="px-3 py-1 bg-accent text-white rounded-lg text-xs hover:bg-accent-dark"
                    >
                      Start Sprint
                    </button>
                  )}
                  {selectedSprint.isStarted &&
                    selectedSprint.initialBacklogTaskCount !== undefined && (
                      <span className="text-sm text-text-secondary">
                        Initial Tasks: {selectedSprint.initialBacklogTaskCount}
                      </span>
                    )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              {selectedSprint && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  <SprintForm
                    sprint={selectedSprint}
                    onUpdate={handleSprintUpdate}
                    onRemoveTask={handleRemoveTaskFromSprint}
                    onStartSprint={handleStartSprint}
                  />
                </div>
              )}
            </div>
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg">
                <TaskBacklog
                  tasks={sortedBacklogTasks}
                  filterOptions={filterOptions}
                  sortOption={sortOption}
                  onTaskSelect={handleTaskSelect}
                  onAddToSprint={handleAddTaskToSprint}
                  onBulkSelection={handleBulkSelection}
                  onBulkEstimation={handleBulkEstimation}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  selectedSprint={selectedSprint}
                  epics={epics}
                  priorities={priorities}
                  assignees={assignees}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <TaskDetailModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskId={selectedTaskId}
      />
    </div>
  );
};

export default SprintPlanning;
