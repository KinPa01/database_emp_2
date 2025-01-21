<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = $request->input('search');
            $gender = $request->input('gender');

            // Query data with joins
            $employees = DB::table("employees")
                ->leftJoin('dept_emp', 'employees.emp_no', '=', 'dept_emp.emp_no')
                ->leftJoin('departments', 'dept_emp.dept_no', '=', 'departments.dept_no')
                ->where(function ($q) use ($query, $gender) {
                    // Search conditions
                    if ($query) {
                        $q->where('employees.emp_no', 'like', '%' . $query . '%')
                            ->orWhere('employees.first_name', 'like', '%' . $query . '%')
                            ->orWhere('employees.last_name', 'like', '%' . $query . '%')
                            ->orWhere('departments.dept_name', 'like', '%' . $query . '%');
                    }

                    // Gender filter
                    if ($gender) {
                        $q->where('employees.gender', '=', $gender);
                    }
                })
                ->select('employees.*', 'departments.dept_name') // Select required fields
                ->paginate(10) // Paginate results
                ->appends($request->query()); // Append query params to pagination links

            // Return view with data
            return Inertia::render('Employee/Index', [
                'employees' => $employees,
                'search' => $query,
                'gender' => $gender,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching employees: ' . $e->getMessage());
            return back()->with('error', 'Failed to load employees. Please try again.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข้อมูล เพื่อไปแสดงให้เลือกรายการในแบบฟอร์ม
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        // ส่งข้อมูลไปยังหน้า Inertia
        return Inertia::render('Employee/Create', ['departments' => $departments]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the input data
            $validated = $request->validate([
                "birth_date" => "required|date",
                "first_name" => "required|string|max:255",
                "last_name"  => "required|string|max:255",
                "gender"     => "required|in:M,F",
                "hire_date"  => "required|date",
                "dept_no"    => "required|string|max:255",
                "photo"      => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048" // Validate the photo
            ]);

            // Using Database Transaction
            DB::transaction(function () use ($validated, $request) {
                // 1. Generate a new emp_no
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1;

                // 2. Upload photo (if exists)
                if ($request->hasFile('photo')) {
                    $file = $request->file('photo');

                    // Log file information
                    Log::info('File uploaded:', [
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                    ]);

                    $photoPath = $file->store('employee_photos', 'public');
                } else {
                    Log::warning('No file was uploaded.');
                    $photoPath = null;
                }

                // 3. Insert data into employees table
                DB::table("employees")->insert([
                    "emp_no"     => $newEmpNo,
                    "first_name" => $validated['first_name'],
                    "last_name"  => $validated['last_name'],
                    "gender"     => $validated['gender'],
                    "birth_date" => $validated['birth_date'],
                    "hire_date"  => $validated['hire_date'],
                    "photo"      => $photoPath  // เก็บ path ของรูปภาพ
                ]);

                // 4. Insert data into dept_emp table
                DB::table("dept_emp")->insert([
                    "emp_no"  => $newEmpNo,
                    "dept_no" => $validated['dept_no'],
                    "from_date" => $validated['hire_date'],
                    "to_date" => '9999-01-01',
                ]);
            });

            // Success
            return redirect()->route('employee.index')
                ->with('success', 'Employee created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating employee: ' . $e->getMessage());
            return back()->with('error', 'Failed to create employee. Please try again.');
        }
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
