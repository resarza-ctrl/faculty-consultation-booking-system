/* ConsultEase — UI micro-interactions */
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all flash toasts
  document.querySelectorAll('.toast').forEach(function (el) {
    var toast = new bootstrap.Toast(el);
    toast.show();
    el.addEventListener('hidden.bs.toast', function () {
      var container = document.getElementById('flashToasts');
      if (container && container.children.length === 0) {
        container.remove();
      }
    });
  });

  // Character counter for textarea fields with data-maxlength
  document.querySelectorAll('textarea[data-maxlength]').forEach(function (el) {
    var counter = document.getElementById(el.id + '-count');
    if (!counter) return;
    var max = parseInt(el.getAttribute('data-maxlength'), 10) || 500;
    var update = function () {
      var len = el.value.length;
      counter.textContent = len + ' / ' + max + ' characters';
      counter.classList.toggle('is-warn', len > max * 0.85 && len <= max);
      counter.classList.toggle('is-over', len > max);
      counter.classList.remove('d-none');
    };
    el.addEventListener('input', update);
    update();
  });

  // Bootstrap client-side validation state on submit
  document.querySelectorAll('form[data-live-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Live validation feedback for required fields
  document.querySelectorAll('form[data-live-validate] .form-control, form[data-live-validate] .form-select').forEach(function (el) {
    el.addEventListener('input', function () {
      if (el.value.trim()) {
        el.classList.remove('is-invalid');
        if (el.checkValidity()) el.classList.add('is-valid');
      } else {
        el.classList.remove('is-valid');
      }
    });
  });

  // One-click demo credential fill on the login page
  document.querySelectorAll('[data-fill-username]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var user = document.getElementById('username');
      var pass = document.getElementById('password');
      if (user) {
        user.value = chip.getAttribute('data-fill-username');
        user.dispatchEvent(new Event('input'));
        user.focus();
      }
      if (pass) {
        pass.value = chip.getAttribute('data-fill-password') || '';
        pass.dispatchEvent(new Event('input'));
      }
    });
  });
});
