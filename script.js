const defaultApplications = [
    {
        id: 1,
        company: "Google",
        position: "Frontend Developer",
        status: "Applied",
        appliedDate: "2026-10-20",
        salary: 150000
    },
    {
        id: 2,
        company: "Microsoft",
        position: "React Developer",
        status: "Interview",
        appliedDate: "2026-10-22",
        salary: 180000
    },
    {
        id: 3,
        company: "Amazon",
        position: "Software Engineer",
        status: "Rejected",
        appliedDate: "2026-10-25",
        salary: 160000
    }
];

let applications = JSON.parse(localStorage.getItem("applications")) || defaultApplications;
let undoStack = [];
let redoStack = [];
function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}
function saveHistory() {
    undoStack.push(JSON.stringify(applications));
    redoStack = [];
}
let activityLog = [];

function addActivity(message) {
    activityLog.push(message);

    const activityHistory = document.getElementById("activityHistory");

    activityHistory.innerHTML = "";

    activityLog.forEach(function(activity) {
        activityHistory.innerHTML += `<p>${activity}</p>`;
    });

    console.log("Activity:", message);
}
function undoAction() {
    if (undoStack.length > 0) {
        redoStack.push(JSON.stringify(applications));

        applications = JSON.parse(undoStack.pop());

        saveApplications();
        renderApplications();
        updateStatistics();
addActivity("Undo action performed");
        console.log("Undo Applied:", applications);
    } else {
        console.log("No action available to undo.");
    }
}
function redoAction() {
    if (redoStack.length > 0) {
        undoStack.push(JSON.stringify(applications));

        applications = JSON.parse(redoStack.pop());

        saveApplications();
        renderApplications();
        updateStatistics();
addActivity("Redo action performed");
        console.log("Redo Applied:", applications);
    } else {
        console.log("No action available to redo.");
    }
}
document.getElementById("undoBtn").addEventListener("click", undoAction);

document.getElementById("redoBtn").addEventListener("click", redoAction);
console.log("Job Applications:", applications);

const applicationList = document.getElementById("applicationList");
const totalApplications = document.getElementById("totalApplications");

function updateStatistics() {
    totalApplications.textContent = "Total Applications: " + applications.length;

    document.getElementById("appliedCount").textContent =
        "Applied: " + applications.filter(function(application) {
            return application.status === "Applied";
        }).length;

    document.getElementById("interviewCount").textContent =
        "Interview: " + applications.filter(function(application) {
            return application.status === "Interview";
        }).length;

    document.getElementById("offeredCount").textContent =
        "Offered: " + applications.filter(function(application) {
            return application.status === "Offered";
        }).length;

    document.getElementById("rejectedCount").textContent =
        "Rejected: " + applications.filter(function(application) {
            return application.status === "Rejected";
        }).length;
}

updateStatistics();
let currentPage = 1;
const applicationsPerPage = 3;

function renderApplications(displayApplications = applications) {
    applicationList.innerHTML = "";

    const totalPages = Math.ceil(displayApplications.length / applicationsPerPage);

    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }

    const startIndex = (currentPage - 1) * applicationsPerPage;
    const endIndex = startIndex + applicationsPerPage;

   const pageApplications = displayApplications.slice(startIndex, endIndex);

    pageApplications.forEach(function(application) {
        applicationList.innerHTML += `
            <div>
                <h3>${application.company}</h3>
                <p>ID: ${application.id}</p>
                <p>Position: ${application.position}</p>
                <p>Status: ${application.status}</p>

                <select class="statusSelect" data-id="${application.id}">
                    <option value="Applied" ${application.status === "Applied" ? "selected" : ""}>Applied</option>
                    <option value="Interview" ${application.status === "Interview" ? "selected" : ""}>Interview</option>
                    <option value="Offered" ${application.status === "Offered" ? "selected" : ""}>Offered</option>
                    <option value="Rejected" ${application.status === "Rejected" ? "selected" : ""}>Rejected</option>
                </select>

                <p>Applied Date: ${application.appliedDate}</p>
                <p>Salary: ${application.salary}</p>
                <button class="deleteBtn" data-id="${application.id}">Delete</button>
            </div>
        `;
    });

    document.getElementById("pageNumber").textContent =
        "Page " + currentPage + " of " + Math.max(1, totalPages);

    document.getElementById("prevBtn").disabled = currentPage === 1;

    document.getElementById("nextBtn").disabled =
        currentPage >= totalPages;
}


const applicationForm = document.getElementById("applicationForm");

applicationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const company = document.getElementById("company").value.trim();
const position = document.getElementById("position").value.trim();
    const appliedDate = document.getElementById("appliedDate").value;
    const salary = Number(document.getElementById("salary").value);
    if (company === "" || position === "") {
    alert("Please enter company name and job position.");
    return;
}
    console.log("Company:", company);
    console.log("Position:", position);
    console.log("Applied Date:", appliedDate);
    console.log("Salary:", salary);
    const newApplication = {
   id: (applications.length > 0 ? Math.max(...applications.map(function(application) {
    return application.id;
})) : 0) + 1,
    company: company,
    position: position,
    status: "Applied",
    appliedDate: appliedDate,
    salary: salary
};
saveHistory();
applications.push(newApplication);
addActivity("New application added: " + newApplication.company);

saveApplications();
updateStatistics();
filterApplications();

console.log("New Application Added:", newApplication);
console.log("Updated Job Applications:", applications);

applicationForm.reset();
});
applicationList.addEventListener("change", function(event) {

    if (event.target.classList.contains("statusSelect")) {

        const applicationId = Number(event.target.dataset.id);
        const newStatus = event.target.value;

        const application = applications.find(function(app) {
            return app.id === applicationId;
        });

        if (application) {
            saveHistory();
            application.status = newStatus;

            addActivity(application.company + " status updated to " + newStatus);
saveApplications();
updateStatistics();
filterApplications();
        }

        console.log("Status Updated:", application);
        console.log("Updated Job Applications:", applications);
    }

});

applicationList.addEventListener("click", function(event) {

    if (event.target.classList.contains("deleteBtn")) {

        const applicationId = Number(event.target.dataset.id);

        const deletedApplication = applications.find(function(application) {
            return application.id === applicationId;
        });

        if (deletedApplication) {
            saveHistory();

            addActivity("Application deleted: " + deletedApplication.company);

            applications = applications.filter(function(application) {
                return application.id !== applicationId;
            });

            saveApplications();
updateStatistics();
filterApplications();
        }

        console.log("Application Deleted. ID:", applicationId);
        console.log("Updated Job Applications:", applications);
    }

});
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

function filterApplications() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const minSalary = Number(document.getElementById("minSalary").value) || 0;
    const maxSalary = Number(document.getElementById("maxSalary").value) || Infinity;

    const filteredApplications = applications.filter(function(application) {
        const matchesSearch =
            application.company.toLowerCase().includes(searchValue) ||
            application.position.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "All" || application.status === selectedStatus;

        const matchesSalary =
            application.salary >= minSalary &&
            application.salary <= maxSalary;

        return matchesSearch && matchesStatus && matchesSalary;
    });

    currentPage = 1;
    renderApplications(filteredApplications);
}
document.getElementById("minSalary").addEventListener("input", filterApplications);
document.getElementById("maxSalary").addEventListener("input", filterApplications);
searchInput.addEventListener("input", filterApplications);
statusFilter.addEventListener("change", filterApplications);
const sortApplications = document.getElementById("sortApplications");

sortApplications.addEventListener("change", function() {
    const sortValue = sortApplications.value;

    const applicationCards = Array.from(applicationList.children);

    applicationCards.sort(function(a, b) {
        const dateA = a.querySelectorAll("p")[3].textContent.replace("Applied Date: ", "");
        const dateB = b.querySelectorAll("p")[3].textContent.replace("Applied Date: ", "");

        const salaryA = Number(a.querySelectorAll("p")[4].textContent.replace("Salary: ", ""));
        const salaryB = Number(b.querySelectorAll("p")[4].textContent.replace("Salary: ", ""));

        if (sortValue === "dateAsc") {
            return new Date(dateA) - new Date(dateB);
        }

        if (sortValue === "dateDesc") {
            return new Date(dateB) - new Date(dateA);
        }

        if (sortValue === "salaryAsc") {
            return salaryA - salaryB;
        }

        if (sortValue === "salaryDesc") {
            return salaryB - salaryA;
        }

        return 0;
    });

    applicationCards.forEach(function(card) {
        applicationList.appendChild(card);
    });
});
document.getElementById("prevBtn").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        renderApplications();
    }
});

document.getElementById("nextBtn").addEventListener("click", function() {
    if (currentPage * applicationsPerPage < applications.length) {
        currentPage++;
        renderApplications();
    }
});
filterApplications();