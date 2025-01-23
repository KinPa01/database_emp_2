import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import "../../../css/app.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ employees, search, gender, role, department }) {
    const [searchInput, setSearchInput] = useState(search || '');
    const [genderSearch, setGenderSearch] = useState(gender || '');
    const [departmentSearch, setDepartmentSearch] = useState(department || '');
    const [roleSearch, setRoleSearch] = useState(role || '');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const { links, current_page, last_page } = employees;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employee', {
            search: searchInput,
            gender: genderSearch,
            department: departmentSearch,
            role: roleSearch,
        });
    };

    const handlePageChange = (url) => {
        if (url) {
            const params = new URLSearchParams({
                search: searchInput,
                gender: genderSearch,
                department: departmentSearch,
                role: roleSearch,
            }).toString();

            router.get(`${url}&${params}`);
        }
    };

    const handleNextPage = () => {
        if (current_page < last_page) {
            const params = new URLSearchParams({
                search: searchInput,
                gender: genderSearch,
                department: departmentSearch,
                role: roleSearch,
            }).toString();

            handlePageChange(`/employee?page=${current_page + 1}&${params}`);
        }
    };

    const handlePreviousPage = () => {
        if (current_page > 1) {
            const params = new URLSearchParams({
                search: searchInput,
                gender: genderSearch,
                department: departmentSearch,
                role: roleSearch,
            }).toString();

            handlePageChange(`/employee?page=${current_page - 1}&${params}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Employee List
                </h2>
            }
        >
            <div className="employee-page">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-fields">
                        <input
                            type="text"
                            placeholder="Search by ID, First Name, Last Name, Department, Birthday"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={genderSearch}
                            onChange={(e) => setGenderSearch(e.target.value)}
                            className="search-select"
                        >
                            <option value="">Select gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        <button type="submit" className="search-button decorated-button">Search</button>
                    </div>
                </form>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Department</th>
                                <th>Birthday</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee, index) => (
                                    <tr key={index}>
                                        <td>
                                            {employee.photo ? (
                                                <img
                                                    src={`/storage/${employee.photo}`} // Correct path to the photo
                                                    alt="Employee Photo"
                                                    className="employee-photo"
                                                    style={{ width: '86px', height: '86px', objectFit: 'cover' }}
                                                    onClick={() => setSelectedPhoto(employee.photo)} // เมื่อคลิก ให้ตั้งค่ารูป
                                                />
                                            ) : (
                                                <span>No photo</span> // Default text when no photo is available
                                            )}
                                        </td>
                                        <td>{employee.emp_no}</td>
                                        <td>{employee.first_name}</td>
                                        <td>{employee.last_name}</td>
                                        <td>{employee.dept_name}</td>
                                        <td>{employee.birth_date}</td>
                                        <td>{employee.gender}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        onClick={handlePreviousPage}
                        disabled={current_page <= 1}
                    >
                        Back
                    </button>
                    <span className='page-number'>Page {current_page} of {last_page}</span>
                    <button
                        className="pagination-button"
                        onClick={handleNextPage}
                        disabled={current_page >= last_page}
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* Modal สำหรับแสดงภาพขยาย */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img
                            src={`/storage/${selectedPhoto}`}
                            alt="Employee"
                            className="max-w-full max-h-screen object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-2 left-2 bg-red-500 text-white px-4 py-2 rounded-full"
                        >
                            close
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
