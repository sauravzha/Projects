import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/axios';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
});

type TaskFormData = z.infer<typeof schema>;

interface Props {
    onTaskAdded: () => void;
}

const TaskForm = ({ onTaskAdded }: Props) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            await api.post('/tasks', data);
            reset();
            onTaskAdded();
        } catch (error) {
            alert('Failed to add task');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Add New Task</h3>
            <div className="space-y-4">
                <div>
                    <input
                        placeholder="Task Title"
                        {...register('title')}
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>
                <div>
                    <textarea
                        placeholder="Description"
                        {...register('description')}
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {isSubmitting ? 'Adding...' : 'Add Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
