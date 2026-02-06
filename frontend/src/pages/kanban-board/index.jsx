import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import TaskDetailModal from '../../components/ui/TaskDetailModal';
import ProjectCreationModal from '../../components/modals/ProjectCreationModal';
import TaskCreationModal from '../../components/modals/TaskCreationModal';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';
import { useUser } from '../../context/UserContext';
import KanbanCard from './components/KanbanCard';
import BoardFilters from './components/BoardFilters';
import ColumnHeader from './components/ColumnHeader';
import UnacceptedTasks from './components/UnacceptedTasks';

const KanbanBoard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState({});
  const [unacceptedTasks, setUnacceptedTasks] = useState([]);
  const [columnOrder, setColumnOrder] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskCreationModalOpen, setIsTaskCreationModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('detailed');
  const [filters, setFilters] = useState({
    assignee: 'all',
    priority: 'all',
    sprint: 'all',
    search: ''
  });
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const statusOrder = ['Backlog', 'In Progress', 'Review', 'Done'];
  const { user } = useUser();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTasksAndColumns = async () => {
    try {
      const [tasksRes, sprintsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/tasks/all`),
        axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints`)
      ]);

      const allTasks = {};
      const initialColumns = {
        'Backlog': { id: 'Backlog', title: 'Backlog', taskIds: [], wipLimit: null, color: '#64748B' },
        'In Progress': { id: 'In Progress', title: 'In Progress', taskIds: [], wipLimit: 3, color: '#2563EB' },
        'Review': { id: 'Review', title: 'Review', taskIds: [], wipLimit: 2, color: '#F59E0B' },
        'Done': { id: 'Done', title: 'Done', taskIds: [], wipLimit: null, color: '#059669' }
      };
      const unaccepted = [];

      const processTask = (task, sprintId = null, projectId = null) => {
        const taskData = {
          ...task,
          id: task._id,
          title: task.taskName,
          description: task.taskDescription,
          assignee: task.assignedTo,
          sprintId,
          projectId
        };

        if (task.status === 'Unaccepted') {
          unaccepted.push(taskData);
        } else {
          allTasks[task._id] = taskData;
          const targetStatus = task.status === 'Sprint' ? 'In Progress' : task.status;
          if (initialColumns[targetStatus]) {
            initialColumns[targetStatus].taskIds.push(task._id);
          }
        }
      };

      tasksRes.data.forEach(task => processTask(task, null, task.projectId));
      sprintsRes.data.forEach(sprint => sprint.tasks.forEach(task => processTask(task, sprint._id)));

      setTasks(allTasks);
      setColumns(initialColumns);
      setColumnOrder(statusOrder);
      setUnacceptedTasks(unaccepted);
    } catch (error) {
      console.error('Failed to fetch tasks/columns:', error);
    }
  };

  useEffect(() => { fetchTasksAndColumns(); }, []);

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    // Update local state
    const updatedColumns = { ...columns };
    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      updatedColumns[start.id] = { ...start, taskIds: newTaskIds };
    } else {
      const startTaskIds = [...start.taskIds];
      const finishTaskIds = [...finish.taskIds];
      startTaskIds.splice(source.index, 1);
      finishTaskIds.splice(destination.index, 0, draggableId);
      updatedColumns[start.id] = { ...start, taskIds: startTaskIds };
      updatedColumns[finish.id] = { ...finish, taskIds: finishTaskIds };
    }
    setColumns(updatedColumns);

    // Update backend
    try {
      const task = tasks[draggableId];
      const userEmail = user?.email;
      let backendStatus = destination.droppableId;
      if (backendStatus === 'In Progress' && task.status === 'Sprint') backendStatus = 'Sprint';

      if (task.sprintId) {
        await axios.put(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints/${task.sprintId}/tasks/${draggableId}`, { status: backendStatus, userEmail });
      } else if (task.projectId) {
        await axios.put(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/${task.projectId}/tasks/${draggableId}`, { status: backendStatus, userEmail });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = Object.values(tasks).filter(task =>
    (filters.assignee === 'all' || task.assignee?.name === filters.assignee) &&
    (filters.priority === 'all' || task.priority === filters.priority) &&
    (!filters.search || task.title.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const getFilteredTaskIds = (taskIds) =>
    taskIds.filter(id => filteredTasks.some(task => task.id === id));

  const handleTaskClick = (taskId) => {
    if (isMultiSelectMode) {
      const newSelected = new Set(selectedTasks);
      newSelected.has(taskId) ? newSelected.delete(taskId) : newSelected.add(taskId);
      setSelectedTasks(newSelected);
    } else {
      setSelectedTaskId(taskId);
      setIsTaskModalOpen(true);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    const userEmail = user?.email;
    try {
      for (const taskId of selectedTasks) {
        const task = tasks[taskId];
        let backendStatus = (newStatus === 'In Progress' && task.status === 'Sprint') ? 'Sprint' : newStatus;
        if (task.sprintId) {
          await axios.put(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints/${task.sprintId}/tasks/${taskId}`, { status: backendStatus, userEmail });
        } else if (task.projectId) {
          await axios.put(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects/${task.projectId}/tasks/${taskId}`, { status: backendStatus, userEmail });
        }
      }
      setSelectedTasks(new Set());
      setIsMultiSelectMode(false);
      fetchTasksAndColumns();
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onNewProjectClick={() => setIsProjectModalOpen(true)} onNewTaskClick={() => setIsTaskCreationModalOpen(true)} />
      <CommandPalette />

      <TaskCreationModal isOpen={isTaskCreationModalOpen} onClose={() => setIsTaskCreationModalOpen(false)} onTaskCreated={fetchTasksAndColumns} />
      <ProjectCreationModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
      <TaskDetailModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} taskId={selectedTaskId} />

      {isMobile ? (
        <div className="flex items-center justify-center h-screen text-text-secondary px-4 text-center">
          <p>Kanban board is only available on desktop view.</p>
        </div>
      ) : (
        <main className="ml-60 mt-16 p-6 flex flex-col h-[calc(100vh-4rem)]">
          <PageHeader actions={
            <>
              <button onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')} className="flex items-center px-4 py-2 bg-secondary-100 rounded hover:bg-secondary-200">
                <Icon name={viewMode === 'detailed' ? 'LayoutGrid' : 'List'} size={16} />
                <span className="ml-2 text-sm">{viewMode === 'detailed' ? 'Compact' : 'Detailed'}</span>
              </button>
              <button onClick={() => setIsTaskCreationModalOpen(true)} className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-700">
                <Icon name="Plus" size={16} />
                <span className="ml-2 text-sm">Add Task</span>
              </button>
            </>
          } />

          <BoardFilters filters={filters} onFiltersChange={setFilters} tasks={Object.values(tasks)} />

          {selectedTasks.size > 0 && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded flex justify-between items-center">
              <span className="text-primary">{selectedTasks.size} selected</span>
              <select onChange={(e) => handleBulkStatusUpdate(e.target.value)} className="px-3 py-1 border rounded">
                <option value="" disabled>Move to...</option>
                {statusOrder.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
              <button onClick={() => { setSelectedTasks(new Set()); setIsMultiSelectMode(false); }} className="text-secondary-600">Cancel</button>
            </div>
          )}

          <UnacceptedTasks tasks={unacceptedTasks} onAcceptTask={fetchTasksAndColumns} />

          <div className="flex-grow overflow-y-auto mt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columnOrder.map(columnId => {
                  const column = columns[columnId];
                  if (!column) return null;
                  const columnTasks = getFilteredTaskIds(column.taskIds).map(id => tasks[id]);
                  return (
                    <div key={column.id} className="flex flex-col">
                      <ColumnHeader column={column} taskCount={columnTasks.length} wipLimit={column.wipLimit} />
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className={`p-3 rounded overflow-y-auto ${snapshot.isDraggingOver ? 'bg-primary-50' : 'bg-secondary-50'}`}>
                            {columnTasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <KanbanCard task={task} viewMode={viewMode} isSelected={selectedTasks.has(task.id)} isMultiSelectMode={isMultiSelectMode} isDragging={snapshot.isDragging} onClick={() => handleTaskClick(task.id)} />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            <button onClick={() => setIsTaskCreationModalOpen(true)} className="w-full mt-3 p-3 border-dashed border-2 rounded text-secondary-500 hover:border-primary-300 hover:text-primary flex items-center justify-center space-x-2">
                              <Icon name="Plus" size={16} />
                              <span className="text-sm">Add task</span>
                            </button>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        </main>
      )}
    </div>
  );
};

export default KanbanBoard;
