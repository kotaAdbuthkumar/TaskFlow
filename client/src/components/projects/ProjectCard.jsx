import React from 'react';
import { FolderKanban, CheckCircle2, Clock, Edit, Trash2 } from 'lucide-react';

const ProjectCard = ({
  project,
  onClick,
  onEdit,
  onDelete,
}) => {
  const { name, description, color = '#6366f1', totalTasks = 0, completedTasks = 0, pendingTasks = 0, progress = 0, members = [] } = project;

  return (
    <div
      onClick={() => onClick && onClick(project)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:border-brand-500/40 dark:hover:border-brand-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: color }}
            >
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
                {name}
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {totalTasks} total tasks
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit project"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6">
          {description || 'No project description added.'}
        </p>
      </div>

      {/* Progress & Stats */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span style={{ color }}>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>

        {/* Bottom Task Metrics & Members */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completedTasks} Done
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {pendingTasks} Pending
            </span>
          </div>

          {/* Members Avatars */}
          {members.length > 0 && (
            <div className="flex items-center -space-x-2 overflow-hidden">
              {members.slice(0, 3).map((m) => (
                <img
                  key={m._id}
                  src={
                    m.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`
                  }
                  alt={m.name}
                  title={m.name}
                  className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                />
              ))}
              {members.length > 3 && (
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  +{members.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
