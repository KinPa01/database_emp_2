<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $firstName = $request->input('first_name');
        $lastName = $request->input('last_name');
        $gender = $request->input('gender');
        $department = $request->input('department'); // เพิ่มการค้นหาแผนก
        $role = $request->input('role'); // เพิ่มการค้นหางาน

        $employees = DB::table("employees")
            ->leftJoin('dept_emp', 'employees.emp_no', '=', 'dept_emp.emp_no')
            ->leftJoin('departments', 'dept_emp.dept_no', '=', 'departments.dept_no')
            ->leftJoin('dept_manager', function ($join) {
                $join->on('employees.emp_no', '=', 'dept_manager.emp_no')
                    ->on('dept_emp.dept_no', '=', 'dept_manager.dept_no');
            })
            ->where(function ($queryBuilder) use ($firstName, $lastName, $gender, $department, $role) {
                if ($firstName) {
                    $queryBuilder->where('employees.first_name', 'like', '%' . $firstName . '%');
                }
                if ($lastName) {
                    $queryBuilder->where('employees.last_name', 'like', '%' . $lastName . '%');
                }
                if ($gender) {
                    $queryBuilder->where('employees.gender', '=', $gender);
                }
                if ($department) {
                    $queryBuilder->where('departments.dept_name', 'like', '%' . $department . '%');
                }
                if ($role) {
                    $queryBuilder->where(DB::raw('CASE WHEN dept_manager.emp_no IS NOT NULL THEN "Manager" ELSE "Employee" END'), 'like', '%' . $role . '%');
                }
            });

        if ($role === 'Manager') {
            $employees->whereNotNull('dept_manager.emp_no');
        } elseif ($role === 'Employee') {
            $employees->whereNull('dept_manager.emp_no');
        }

        $employees = $employees->select(
            'employees.emp_no',
            'employees.first_name',
            'employees.last_name',
            'employees.gender',
            'employees.birth_date',
            'departments.dept_name',
            DB::raw('CASE WHEN dept_manager.emp_no IS NOT NULL THEN "Manager" ELSE "Employee" END AS position')
        )->paginate(10);

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'gender' => $gender,
            'role' => $role,
            'department' => $department, // ส่งค่าค้นหาแผนก
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
