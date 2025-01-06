import { router } from '@inertiajs/react';
import { useState } from 'react';
import "../../../css/app.css";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ employees, query, first_name, last_name, gender, role, department }) {
    const [search, setSearch] = useState(query || '');
    const [genderSearch, setGenderSearch] = useState(gender || '');
    const [firstNameSearch, setFirstNameSearch] = useState(first_name || '');
    const [lastNameSearch, setLastNameSearch] = useState(last_name || '');
    const [departmentSearch, setDepartmentSearch] = useState(department || ''); // state for department
    const [roleSearch, setRoleSearch] = useState(role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/employee', {
            search,
            gender: genderSearch,
            first_name: firstNameSearch,
            last_name: lastNameSearch,
            department: departmentSearch, // sending department
            role: roleSearch,
        });
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
                            placeholder="Search by First Name"
                            value={firstNameSearch}
                            onChange={(e) => setFirstNameSearch(e.target.value)}
                            className="search-input"
                        />
                        <input
                            type="text"
                            placeholder="Search by Last Name"
                            value={lastNameSearch}
                            onChange={(e) => setLastNameSearch(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={genderSearch}
                            onChange={(e) => setGenderSearch(e.target.value)}
                            className="search-select"
                        >
                            <option value="">All</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>

                        {/* Department select dropdown */}
                        <select
                            value={departmentSearch}
                            onChange={(e) => setDepartmentSearch(e.target.value)}
                            className="search-select"
                        >
                            <option value="">All Departments</option>
                            <option value="Customer Service">Customer Service</option>
                            <option value="Development">Development</option>
                            <option value="Finance">Finance</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Production">Production</option>
                            <option value="Quality Management">Quality Management</option>
                            <option value="Research">Research</option>
                            <option value="Sales">Sales</option>
                        </select>

                        <select
                            value={roleSearch}
                            onChange={(e) => setRoleSearch(e.target.value)}
                            className="search-select"
                        >
                            <option value="">All Roles</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Employee</option>
                        </select>

                        <button type="submit" className="search-button">Search</button>
                    </div>
                </form>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Department</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.emp_no}</td>
                                        <td>{employee.first_name}</td>
                                        <td>{employee.last_name}</td>
                                        <td>{employee.gender === "M" ? "Male" : "Female"}</td>
                                        <td>{employee.dept_name}</td>
                                        <td>{employee.position}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
