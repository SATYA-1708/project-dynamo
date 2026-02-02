import React from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from './components/layout/MainLayout';
import { UserProvider } from './context/UserContext';
import { useState } from 'react';
import ProjectCreationModal from './components/modals/ProjectCreationModal';
import SprintCreationModal from './components/modals/SprintCreationModal';
import TaskCreationModal from './components/modals/TaskCreationModal';
import { ModalProvider } from './context/ModalContext';

function App() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleProjectCreated = (newProject) => {
    console.log('New project created:', newProject);
    setIsProjectModalOpen(false);
  };

  const handleSprintCreated = (newSprint) => {
    console.log('New sprint created:', newSprint);
    setIsSprintModalOpen(false);
  };

  const handleTaskCreated = (newTask) => {
    console.log('New task created:', newTask);
    setIsTaskModalOpen(false);
  };

  return (
    <UserProvider>
      <ModalProvider value={{
        isProjectModalOpen, setIsProjectModalOpen,
        isSprintModalOpen, setIsSprintModalOpen,
        isTaskModalOpen, setIsTaskModalOpen,
        handleProjectCreated,
        handleSprintCreated,
        handleTaskCreated,
       }}>
         <BrowserRouter>
           <ErrorBoundary>
             <MainLayout />
           </ErrorBoundary>
         </BrowserRouter>
          <ProjectCreationModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
        <SprintCreationModal
          isOpen={isSprintModalOpen}
          onClose={() => setIsSprintModalOpen(false)}
          onSprintCreated={handleSprintCreated}
        />
        <TaskCreationModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </ModalProvider>
    </UserProvider>
  );
}

export default App;
