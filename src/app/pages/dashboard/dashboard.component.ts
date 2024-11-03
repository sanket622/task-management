import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ConfirmDialogComponent, CustomDatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    status: 'Pending',
    dueDate: new Date(),
  };
  filterStatus: string = 'All';
  isEditMode: boolean = false;
  editingTaskId: number | null = null;

  // Status counts
  pendingCount: number = 0;
  inProgressCount: number = 0;
  completedCount: number = 0;

  ngOnInit() {
    this.loadTasks();
    this.updateStatusCounts();
  }

  // Load tasks from local storage
  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.filteredTasks = [...this.tasks];
    this.updateStatusCounts();
  }

  // Add a new task or update an existing task
  saveTask() {
    if (this.isEditMode && this.editingTaskId !== null) {
      // Update task
      const index = this.tasks.findIndex(
        (task) => task.id === this.editingTaskId
      );
      if (index > -1) {
        this.tasks[index] = { ...this.newTask };
      }
      this.isEditMode = false;
      this.editingTaskId = null;
    } else {
      // Add new task
      this.newTask.id = this.tasks.length
        ? this.tasks[this.tasks.length - 1].id + 1
        : 1;
      this.tasks.push({ ...this.newTask });
    }

    this.saveTasks();
    this.resetTaskForm();
  }

  // Enable edit mode and populate form with the selected task's data
  editTask(task: Task) {
    this.newTask = { ...task };
    this.isEditMode = true;
    this.editingTaskId = task.id;
  }

  // Delete a task
  deleteTask(taskId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // If the user confirmed, proceed with deletion
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveTasks();
      }
    });
  }

  // Save tasks to local storage and update counts
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.applyFilter();
    this.updateStatusCounts();
  }

  // Reset task form
  resetTaskForm() {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      status: 'Pending',
      dueDate: new Date(),
    };
    this.isEditMode = false;
    this.editingTaskId = null;
  }

  // Filter tasks by status
  applyFilter() {
    if (this.filterStatus === 'All') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === this.filterStatus
      );
    }
    this.updateStatusCounts();
  }

  // Update counts for each task status
  updateStatusCounts() {
    this.pendingCount = this.tasks.filter(
      (task) => task.status === 'Pending'
    ).length;
    this.inProgressCount = this.tasks.filter(
      (task) => task.status === 'In Progress'
    ).length;
    this.completedCount = this.tasks.filter(
      (task) => task.status === 'Completed'
    ).length;
  }

  isDarkMode = false;

  toggleDarkMode(event: any) {
    this.isDarkMode = event.target.checked;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
