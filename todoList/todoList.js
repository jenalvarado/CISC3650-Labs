document.addEventListener('DOMContentLoaded', function() {
    const celebrationSound = new Audio('doneEffect.mp3');
  
    window.addTask = function() {
      const taskInput = document.getElementById('task-input');
      const dueDateInput = document.getElementById('due-date-input');
      const priorityInput = document.getElementById('priority-input');
      const tasksContainer = document.getElementById('tasks');
  
      if (taskInput.value.trim() === '') {
          alert("Please enter a task name.");
          return;
      }
  
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'flex-wrap', 'rounded', 'mb-3');
  
      switch (priorityInput.value) {
          case 'high':
              taskDiv.classList.add('bg-danger', 'text-white');
              break;
          case 'medium':
              taskDiv.classList.add('bg-warning', 'text-dark');
              break;
          case 'low':
              taskDiv.classList.add('bg-success', 'text-white');
              break;
          default:
              taskDiv.classList.add('bg-light', 'text-dark');
      }
  
      taskDiv.innerHTML = `
          <div class="form-check">
              <input class="form-check-input" type="checkbox" onclick="toggleTaskCompletion(this)">
              <label class="form-check-label">${taskInput.value}</label>
          </div>
          <span class="badge bg-secondary rounded-pill">${dueDateInput.value}</span>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Delete</button>
          <div class="subtasks mt-2 w-100"></div>
          <input type="text" class="form-control mt-2" placeholder="Add a subtask..." onkeypress="if(event.keyCode === 13) addSubtask(this)">
          <button class="btn btn-info btn-sm mt-2" onclick="addSubtask(this.previousElementSibling)">Add Subtask</button>
      `;
  
      // Insert the task at the correct position based on due date and priority
      const existingTasks = Array.from(tasksContainer.children);
      
      existingTasks.push(taskDiv); // Add the new task to the existing tasks
      existingTasks.sort((a, b) => {
          const dueDateA = new Date(a.querySelector('.badge').textContent);
          const dueDateB = new Date(b.querySelector('.badge').textContent);
          const priorityA = a.classList.contains('bg-danger') ? 3 : a.classList.contains('bg-warning') ? 2 : 1;
          const priorityB = b.classList.contains('bg-danger') ? 3 : b.classList.contains('bg-warning') ? 2 : 1;
  
          if (priorityA !== priorityB) {
              return priorityB - priorityA; // Sort by priority first
          } else {
              return dueDateA - dueDateB; // If priorities are equal, sort by due date
          }
      });
  
      // Reorder the tasks in the container based on the sorted array
      existingTasks.forEach(task => tasksContainer.appendChild(task));
  
      taskInput.value = '';
      dueDateInput.value = '';
      priorityInput.selectedIndex = 0;
    };
  
    window.toggleTaskCompletion = function(checkbox) {
      const taskDiv = checkbox.closest('.list-group-item');
      const mainTaskCheckbox = taskDiv.querySelector('.form-check-input'); // The first checkbox in the taskDiv is assumed to be the main task's checkbox.
      const label = checkbox.nextElementSibling;
  
      if (checkbox.checked) {
          label.classList.add('text-decoration-line-through');
          // If this is a subtask being checked, check if all are now checked and if so, check the main task and play sound.
          if (checkbox !== mainTaskCheckbox) {
              const subtaskCheckboxes = taskDiv.querySelectorAll('.subtasks .form-check-input');
              const allChecked = Array.from(subtaskCheckboxes).every(subtaskCheckbox => subtaskCheckbox.checked);
              if (allChecked) {
                  mainTaskCheckbox.checked = true;
                  mainTaskCheckbox.nextElementSibling.classList.add('text-decoration-line-through');
                  celebrationSound.play().catch(error => console.error("Audio playback failed:", error));
              }
          } else {
              // This is the main task being checked, so check all subtasks and play sound.
              celebrationSound.play().catch(error => console.error("Audio playback failed:", error));
              const subtaskCheckboxes = taskDiv.querySelectorAll('.subtasks .form-check-input');
              subtaskCheckboxes.forEach(subtaskCheckbox => {
                  subtaskCheckbox.checked = true;
                  subtaskCheckbox.nextElementSibling.classList.add('text-decoration-line-through');
              });
          }
      } else {
          label.classList.remove('text-decoration-line-through');
          // If this is the main task being unchecked, uncheck all subtasks.
          if (checkbox === mainTaskCheckbox) {
              const subtaskCheckboxes = taskDiv.querySelectorAll('.subtasks .form-check-input');
              subtaskCheckboxes.forEach(subtaskCheckbox => {
                  subtaskCheckbox.checked = false;
                  subtaskCheckbox.nextElementSibling.classList.remove('text-decoration-line-through');
              });
          } else {
              // A subtask is being unchecked, so uncheck the main task as well.
              mainTaskCheckbox.checked = false;
              mainTaskCheckbox.nextElementSibling.classList.remove('text-decoration-line-through');
          }
      }
    };
  
    window.deleteTask = function(deleteButton) {
      const taskDiv = deleteButton.closest('.list-group-item');
      taskDiv.remove();
    };
  
    window.addSubtask = function(inputElement) {
      const subtasksContainer = inputElement.closest('.list-group-item').querySelector('.subtasks');
      if (subtasksContainer && inputElement.value.trim() !== '') {
          const subtaskDiv = document.createElement('div');
          subtaskDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-1', 'ms-3');
          subtaskDiv.innerHTML = `
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" onclick="toggleTaskCompletion(this)">
                  <label class="form-check-label">${inputElement.value}</label>
              </div>
              <button class="btn btn-warning btn-sm" onclick="deleteSubtask(this)">Delete</button>
          `;
  
          subtasksContainer.appendChild(subtaskDiv);
          inputElement.value = ''; // Clear the input after adding the subtask
      } else {
          alert("Please enter a subtask name.");
      }
    };
  
    window.deleteSubtask = function(deleteButton) {
      const subtaskDiv = deleteButton.closest('div');
      subtaskDiv.remove();
    };
});
