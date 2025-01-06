import { router } from '@inertiajs/react';
import { useState } from 'react';

// query = ค่าของการค้นหาที่ส่งกลับมาจาก controller
// employees = ข้อมูลพนักงานที่ส่งกลับมาจาก controller
export default function Index({ employees, query }) {
    const [search, setSearch] = useState(query || '');

    const handleSearch = (e) => {

        e.preventDefault();
        // search คือค่าที่เราพิมพ์ในช่อง input
        router.get('/employee', { search });
    };
    return (
    <div>
        <h1>Employee List</h1>
        <form form onSubmit={handleSearch}>
            <input
                type="text"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            <button type="submit">
                Search
            </button>
        </form>
        <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Age</th>
                    </tr>
                </thead>
            <tbody> {employees.data.length > 0 ? (
                    employees.data.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.emp_no}</td>
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td>{employee.birth_date}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>
                            No employees found for "{search}"
                        </td>
                    </tr>
                )}
            </tbody>
            <div>
                <button
                    disabled={!employees.prev_page_url}
                    onClick={()=>
                    window.location.assign(employees.prev_page_url)
                }>
                    Previous
                </button>
                <button  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    disabled={!employees.next_page_url}
                    onClick={()=>
                    window.location.assign(employees.next_page_url)
                }>
                    Next
                </button>
            </div>
        </table>
    </div>
    );
 }
