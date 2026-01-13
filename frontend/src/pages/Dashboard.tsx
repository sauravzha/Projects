import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import type { Task } from '../types';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { LogOut, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || task.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <UserIcon size={20} />
                            <span>{user?.username}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-1 rounded-md bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 transition"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Create Task Column */}
                    <div className="md:col-span-1">
                        <TaskForm onTaskAdded={fetchTasks} />
                    </div>

                    {/* Task List Column */}
                    <div className="md:col-span-2">

                        {/* Search & Filter */}
                        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                            <input
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
