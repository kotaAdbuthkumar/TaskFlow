import React, { useState, useEffect } from 'react';
import { Plus, FolderKanban, Sparkles } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const ProjectsPage = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/projects');
      setProjects(res.projects || []);
    } catch (err) {
      error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await axiosClient.delete(`/projects/${projectToDelete._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
      success('Project deleted. Associated tasks unlinked.');
      setProjectToDelete(null);
    } catch (err) {
      error(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Group your tasks into strategic projects, goals, and categories.
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 && !loading ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project like 'Web Development', 'College', or 'Personal' to organize tasks."
          actionLabel="Create Project"
          onAction={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={(p) => onNavigate(`/tasks?project=${p._id}`)}
              onEdit={(p) => {
                setProjectToEdit(p);
                setIsModalOpen(true);
              }}
              onDelete={(p) => setProjectToDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
        onProjectSaved={() => fetchProjects()}
      />

      {/* Confirm Delete Project Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? Tasks associated with this project will be kept but unlinked.`}
        confirmText="Delete Project"
        loading={deleting}
      />
    </div>
  );
};

export default ProjectsPage;
