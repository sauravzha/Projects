import type { Task } from '../types';
import api from '../lib/axios';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

interface Props {
    tasks: Task[];
    onTaskUpdated: () => void;
}

const TaskList = ({ tasks, onTaskUpdated }: Props) => {

    const toggleStatus = async (task: Task) => {
        try {
            await api.put(`/tasks/${task._id}`, {
                status: task.status === 'completed' ? 'pending' : 'completed',
            });
            onTaskUpdated();
        } catch (error) {
            console.error(error);
            alert('Failed to update task');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            onTaskUpdated();
        } catch (error) {
            console.error(error);
            alert('Failed to delete task');
        }
    };

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => toggleStatus(task)} className="text-gray-400 hover:text-green-600 transition">
                            {task.status === 'completed' ? <CheckCircle className="text-green-600" /> : <Circle />}
                        </button>
                        <div className={task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleDelete(task._id)} className="text-red-400 hover:text-red-600 transition">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No tasks found. Create one above!
                </div>
            )}
        </div>
    );
};

export default TaskList;
