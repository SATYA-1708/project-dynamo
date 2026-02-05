import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CommandPalette from '../../components/ui/CommandPalette';
import TaskDetailModal from '../../components/ui/TaskDetailModal';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/AppIcon';
import MetricsCard from './components/MetricsCard';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../../context/ModalContext';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { setIsProjectModalOpen, setIsSprintModalOpen, setIsTaskModalOpen: setGlobalIsTaskModalOpen } = useModal();

  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [sprintsRes, projectsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/sprints`),
        axios.get(`${import.meta.env.VITE_RENDER_BACKEND_URL}/api/projects`),
      ]);
      
      const fetchedSprints = Array.isArray(sprintsRes.data) ? sprintsRes.data : [];
      const fetchedProjects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

      // Enrich sprints with tasks from projects
      const enrichedSprints = fetchedSprints.map(sprint => {
        const project = fetchedProjects.find(p => p._id === sprint.projectId);
        const sprintTasks = project ? project.tasks.filter(task => sprint.tasks.includes(task._id)) : [];
        return { ...sprint, tasks: sprintTasks };
      });

      setSprints(enrichedSprints);
      setProjects(fetchedProjects);

      let totalTasksCount = 0;
      let deadlines = [];
      let allActivities = [];
      let newProjectsThisMonth = 0;
      let newTasksThisWeek = 0;
      let newSprintsThisMonth = 0;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const sevenDaysAgo = new Date(now.setDate(now.getDate() + 23)); // Resetting date and going back 7 days

      enrichedSprints.forEach(sprint => {
        allActivities.push({ type: 'sprint', name: sprint.sprintName, createdAt: sprint.createdAt });
        if (new Date(sprint.createdAt) > thirtyDaysAgo) {
          newSprintsThisMonth++;
        }
        totalTasksCount += sprint.tasks.length;
        sprint.tasks.forEach(task => {
          allActivities.push({ type: 'task', name: task.taskName, createdAt: task.createdAt });
          if (task.dueDate && new Date(task.dueDate) > new Date()) {
            deadlines.push(task);
          }
          if (new Date(task.createdAt) > sevenDaysAgo) {
            newTasksThisWeek++;
          }
        });
      });
      
      fetchedProjects.forEach(project => {
        allActivities.push({ type: 'project', name: project.projectName, createdAt: project.createdAt });
        if (new Date(project.createdAt) > thirtyDaysAgo) {
          newProjectsThisMonth++;
        }
        totalTasksCount += project.tasks.length;
        project.tasks.forEach(task => {
          allActivities.push({ type: 'task', name: task.taskName, createdAt: task.createdAt });
          if (task.dueDate && new Date(task.dueDate) > new Date()) {
            deadlines.push(task);
          }
          if (new Date(task.createdAt) > sevenDaysAgo) {
            newTasksThisWeek++;
          }
        });
      });
      
      setTasks(totalTasksCount);
      setUpcomingDeadlines(deadlines.length);

      const sortedActivities = allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentActivities(sortedActivities.slice(0, 5));

      setDashboardMetrics({
        activeSprintsCount: fetchedSprints.length,
        totalTasks: totalTasksCount,
        totalProjects: fetchedProjects.length,
        upcomingDeadlines: deadlines.length,
        newProjectsThisMonth: newProjectsThisMonth,
        newTasksThisWeek: newTasksThisWeek,
        newSprintsThisMonth: newSprintsThisMonth,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeSprintsCount: 0,
    totalTasks: 0,
    totalProjects: 0,
    upcomingDeadlines: 0,
    newProjectsThisMonth: 0,
    newTasksThisWeek: 0,
    newSprintsThisMonth: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const sprintData = {
    currentSprint: sprints.length > 0 ? {
      name: sprints[0].name,
      completedPoints: sprints[0].initialBacklogTaskCount - sprints[0].currentBacklogTaskCount,
      totalPoints: sprints[0].initialBacklogTaskCount,
      startDate: sprints[0].startDate,
      endDate: sprints[0].endDate,
      progress: sprints[0].initialBacklogTaskCount > 0 
        ? ((sprints[0].initialBacklogTaskCount - sprints[0].currentBacklogTaskCount) / sprints[0].initialBacklogTaskCount) * 100
        : 0,
      tasks: sprints[0].tasks,
    } : { message: 'No current sprints' },
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleProjectCreated = (newProject) => {
    console.log('New project created:', newProject);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const handleSprintCreated = (newSprint) => {
    console.log('New sprint created:', newSprint);
    // Optionally, refresh sprint data or add the new sprint to state
  };

  const handleCloseSprintModal = () => {
    setIsSprintModalOpen(false);
  };

  const handleTaskCreated = () => {
    console.log('New task created! Refreshing data...');
    fetchDashboardData();
  };



  // ✅ Correct: useEffect inside component
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            console.log('Create new task');
            break;
          case 's':
            event.preventDefault();
            navigate('/sprint-planning');
            break;
          case 'i':
            event.preventDefault();
            navigate('/team-management');
            break;
          case 'p':
            event.preventDefault();
            setIsProjectModalOpen(true);
            break;
          case 'r': // 'r' for sprint (run)
            event.preventDefault();
            setIsSprintModalOpen(true);
            break;
          case 'a':
            event.preventDefault();
            navigate('/analytics-dashboard');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onNewProjectClick={() => setIsProjectModalOpen(true)} onNewTaskClick={handleTaskCreated} onNewSprintClick={() => setIsSprintModalOpen(true)} />
      <CommandPalette />

      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          <PageHeader 
            actions={
              <>
                <button
                  onClick={() => navigate('/kanban-board')}
                  className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 flex items-center space-x-2"
                >
                  <Icon name="Kanban" size={16} />
                  <span>View Boards</span>
                </button>
                <button
                  onClick={() => setIsSprintModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                >
                  <Icon name="Calendar" size={16} />
                  <span>Create Sprint</span>
                </button>
                <button
                  onClick={() => navigate('/sprint-planning')}
                  className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 flex items-center space-x-2"
                >
                  <Icon name="List" size={16} />
                  <span>Plan Sprint</span>
                </button>
              </>
            }
          />

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard title="Active Sprints" value={dashboardMetrics.activeSprintsCount} icon="Calendar" color="primary" trend={`${dashboardMetrics.newSprintsThisMonth} new this month`} onClick={() => navigate('/sprint-planning')} />
            <MetricsCard title="Total Tasks" value={dashboardMetrics.totalTasks} icon="Square" color="secondary" trend={`${dashboardMetrics.newTasksThisWeek} new this week`} onClick={() => navigate('/kanban-board')} />
             <MetricsCard title="Total Projects" value={dashboardMetrics.totalProjects} icon="Folder" color="info" trend={`${dashboardMetrics.newProjectsThisMonth} new this month`} onClick={() => navigate('/project-management')} />

            <MetricsCard title="Upcoming Deadlines" value={dashboardMetrics.upcomingDeadlines} icon="Clock" color="warning" trend={`${dashboardMetrics.upcomingDeadlines} due this week`} onClick={() => navigate('/kanban-board')} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <RecentActivity activities={recentActivities} />
            </div>
            <div className="lg:col-span-6">
              <QuickActions />
            </div>

          </div>

          {/* Additional Stats Row */}
         
        </div>
      </main>

      {/* Modals */}
      <TaskDetailModal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} taskId={selectedTaskId} />
    </div>
  );
};

export default DashboardOverview;
