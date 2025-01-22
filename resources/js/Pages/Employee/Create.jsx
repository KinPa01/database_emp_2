import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2'; // Ensure this import is correct

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        birth_date: '',
        first_name: '',
        last_name: '',
        gender: '',
        hire_date: '',
        dept_no: '',
        photo: null,
        wall_name: '', // New field for wall name
    });

    const [warningMessage, setWarningMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setWarningMessage('');

        // ตรวจสอบว่าเรากรอกข้อมูลครบหรือไม่
        if (!data.first_name || !data.last_name || !data.birth_date || !data.hire_date || !data.dept_no || !data.gender) {
            setWarningMessage('Please fill in all the required fields.');

            setTimeout(() => {
                setWarningMessage('');
            }, 2000);
            return;
        }

        post(route('employee.store'), {
            forceFormData: true, // ส่งข้อมูลแบบ FormData (ใช้สำหรับไฟล์)
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "succeed!",
                    text: "Successfully created employees!",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <br />
            <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register Employee</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Birth Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="birth_date">
                            Birth Date
                        </label>
                        <input
                            id="birth_date"
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birth_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.birth_date && <div className="text-red-500 text-sm mt-1">{errors.birth_date}</div>}
                    </div>

                    {/* First Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="first_name">
                            First Name
                        </label>
                        <input
                            id="first_name"
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter first name"
                        />
                        {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                    </div>

                    {/* Last Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="last_name">
                            Last Name
                        </label>
                        <input
                            id="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter last name"
                        />
                        {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {errors.gender && <div className="text-red-500 text-sm mt-1">{errors.gender}</div>}
                    </div>

                    {/* Hire Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="hire_date">
                            Hire Date
                        </label>
                        <input
                            id="hire_date"
                            type="date"
                            value={data.hire_date}
                            onChange={(e) => setData('hire_date', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.hire_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.hire_date && <div className="text-red-500 text-sm mt-1">{errors.hire_date}</div>}
                    </div>

                    {/* Department */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dept_no">
                            Department
                        </label>
                        <select
                            id="dept_no"
                            value={data.dept_no}
                            onChange={(e) => setData('dept_no', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dept_no ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select department</option>
                            {departments.map((department) => (
                                <option key={department.dept_no} value={department.dept_no}>
                                    {department.dept_name}
                                </option>
                            ))}
                        </select>
                        {errors.dept_no && <div className="text-red-500 text-sm mt-1">{errors.dept_no}</div>}
                    </div>
                    {/* Photo */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="photo">
                            Upload Photo
                        </label>
                        <input
                            id="photo"
                            type="file"
                            onChange={(e) => setData('photo', e.target.files[0])}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.photo ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.photo && <div className="text-red-500 text-sm mt-1">{errors.photo}</div>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Register Employee
                        </button>
                    </div>
                </form>
            </div>
            <br />

            {/* Popup Notification */}
            {warningMessage && (
                <div className="popup popup-warning">
                    {warningMessage}
                </div>
            )}

        </AuthenticatedLayout>
    );
}
