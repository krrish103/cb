const chatHistoryDiv = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const closeButton = document.getElementById('close-chatbot'); // Get the close button

// Function to add a message to the chat history
function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    let contentHtml = '';

    if (sender === 'bot') {
        // Function to apply bolding only to text within single quotes
        const applyBolding = (text) => {
            // Regex to find text enclosed in single quotes: 'text'
            // It captures the content inside the quotes (group 1)
            return text.replace(/'([^']+)'/g, `<strong>'$1'</strong>`);
        };

        const lines = message.split('\n');
        let inList = false;
        let currentListHtml = '';

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
                // If empty line, close current list if open
                if (inList) {
                    contentHtml += currentListHtml + '</ul>';
                    currentListHtml = '';
                    inList = false;
                }
                // Add a paragraph break for empty lines outside lists
                contentHtml += '<p></p>';
            } else if (/^\d+\.\s/.test(trimmedLine)) { // Check if it starts with a number and a dot (e.g., "1. ")
                if (!inList) {
                    // Start a new unordered list for the steps
                    contentHtml += '<ul class="list-disc list-inside text-sm text-gray-700 mt-1">';
                    inList = true;
                }
                const cleanedLine = trimmedLine.replace(/^\d+\.\s*/, ''); // Remove the number and dot
                currentListHtml += `<li>${applyBolding(cleanedLine)}</li>`;
            } else {
                // If not a list item, and a list was open, close it
                if (inList) {
                    contentHtml += currentListHtml + '</ul>';
                    currentListHtml = '';
                    inList = false;
                }
                // Add as a paragraph
                contentHtml += `<p>${applyBolding(trimmedLine)}</p>`;
            }
        });

        // Close any open list at the end
        if (inList) {
            contentHtml += currentListHtml + '</ul>';
        }
    } else {
        // User messages are always paragraphs
        contentHtml = `<p>${message}</p>`;
    }

    messageDiv.innerHTML = `
        <div class="${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-3 rounded-lg max-w-[75%] shadow font-sans">
            ${contentHtml}
        </div>
    `;
    chatHistoryDiv.appendChild(messageDiv);
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight; // Scroll to bottom
}

// Simplified User Guide Content for LLM context
const userGuideContent = `
Overall Attendance Process:
1. Define Student Attendance Code
2. Mark Daily Attendance / Manage Monthly Attendance
3. Use various reports available to download the marked attendance data for analysis purposes.

User Guide for Student Attendance

Table of contents:
1. Parameters
2. Student Day wise attendance access role
3. Setup (3.1. Student Attendance Code)
4. Transaction (4.1. Mark Daily Attendance, 4.2. Manage Monthly Attendance, 4.3. Student Attendance Slip Form, 4.4. Absent Students Notifications)
5. Queries (5.1. Export Attendance Data, 5.2. Fire Register Detail)
6. Reports (6.1. Attendance View, 6.2. Attendance Slip Report, 6.3. Attendance Not Marked)

Key functionalities:
- Mark Daily Attendance: Select Grade, Section, date, then Search. Mark students Present/Absent. Right-click for remarks. Submit to save.
- Manage Monthly Attendance: Select Grade, Section, Month, then Search. Right-click on date column to Mark All Present/Absent. Right-click on cell for remarks. Submit to save.
- Student Attendance Slip Form: Select filters, Search. Update time, attendance code (Leave Early/Present Late), slot, remark. Issue to print slip.
- Absent Students Notifications: Select Grade, Section, Attendance code. Show student list. Choose to send Email/SMS/App alerts to parents.
- Export Attendance Data: Select filters, Preview. Click Export to download data to Excel.
- Fire Register Detail: Get attendance report for present students on a selected date (for emergencies). Blue tick indicates present. Click print.
- Attendance View Report: Get reports by Date, Week, Month, or All. 'All' shows attendance between From and To dates.
- Attendance Not Marked Report: List classes where attendance was not marked or partially marked for a date range.
`;

// Predefined FAQs and answers with specific steps from the user guide
const faqs = {
    "how to filter attendance": "To filter attendance:\n1. Locate the filter fields at the top of the screen: 'Curriculum', 'Academic Year', 'Grade', 'Section', 'From Date', and 'To Date'.\n2. Click on each dropdown or date picker to select your desired criteria.\n3. For example, to select a specific 'Grade', click the 'Grade' dropdown and choose from the list.\n4. Once all your desired filters are set, click the 'Preview' button (the green button on the right) to apply the filters and view the updated attendance summary.",
    "how do i export data": "To export the attendance data:\n1. First, apply any necessary filters and preview the data to ensure it's what you want to export.\n2. Locate the blue button next to the 'Preview' button, labeled 'Export'.\n3. Click this 'Export' button. The system will typically generate and download a file (e.g., CSV or Excel) containing the displayed attendance data.",
    "how to mark daily attendance": "To mark daily attendance:\n1. Click on 'Mark Daily Attendance'.\n2. Select the 'Grade', 'Section', and the 'date of attendance'.\n3. Click 'Search' to populate the student list.\n4. You can click 'Mark All Present' or 'Mark All Absent' to quickly set the status for all students.\n5. To mark individual students, select the required attendance code (e.g., Absent, Absent Excused) and choose the student.\n6. Right-click on a student block to add remarks.\n7. Finally, click 'Submit' to save the attendance for the day.",
    "how to manage monthly attendance": "To manage monthly attendance:\n1. Click on 'Manage Monthly Attendance'.\n2. Select the 'Grade', 'Section', and 'Month'.\n3. Click 'Search' to populate the student list with the full month's attendance.\n4. You can right-click on any date column to 'Mark All Present' or 'Mark All Absent' for that day.\n5. To mark individual cells (a specific date for a specific student), select the required attendance code.\n6. Right-click on any cell to add remarks.\n7. Finally, click 'Submit' to save the attendance.",
    "how to issue an attendance slip": "To issue an attendance slip:\n1. Click on 'Student Attendance Slip Form'.\n2. By default, 'Curriculum', 'Academic Year', 'All Grades', 'All Sections', and the current date are selected. Click 'Search' to view the student list.\n3. Update the 'time', select the required 'attendance code' (e.g., Leave Early, Present Late), select the 'slot', and add 'remark' if needed.\n4. Click 'Issue' button to save the data and open the report to print the slip. 'Reissue' button is for reprinting.",
    "what is the overall attendance process": "The overall attendance process involves three main steps:\n1.  **Define Student Attendance Code:** This step involves setting up the various attendance codes (e.g., Present, Absent, Late, Excused Absent).\n2.  **Mark Daily Attendance / Manage Monthly Attendance:** This is where you record student attendance on a daily or monthly basis.\n3.  **Use various reports available to download the marked attendance data for analysis purposes:** After attendance is marked, you can generate and download various reports for analysis.",
    "how to create a new student attendance code": "To create a new student attendance code:\n1. Navigate to 'Student Attendance Code' under the 'Setup' section.\n2. Click on the 'New' button.\n3. Fill in the fields marked with an asterisk (*), such as 'Curriculum', 'Category Code', 'Attendance Code', 'Numeric Code', 'Short Description', 'Description', 'Present Value', 'Absent Value', 'Tardy Value', and 'Type Value'.\n4. Click 'Save' to create the new attendance code.",
    "how to edit an existing student attendance code": "To edit an existing student attendance code:\n1. Navigate to 'Student Attendance Code' under the 'Setup' section.\n2. Locate the attendance code you wish to edit in the list.\n3. Click on the 'Edit' icon (usually a pencil icon) next to the attendance code.\n4. An application window will open in edit mode. Update the required changes in the fields.\n5. Click 'Update' button to save the changes.",
    "how to delete a student attendance code": "To delete a student attendance code:\n1. Navigate to 'Student Attendance Code' under the 'Setup' section.\n2. Select the attendance code you want to remove from the list.\n3. Click on the 'Delete' button.\n4. Confirm the deletion if prompted.",
    "what is the purpose of the 'absent students notifications' feature": "The 'Absent Students Notifications' feature allows users to send notifications (such as email, SMS, or app alerts) to parents in case a student is absent. This helps in promptly informing parents about their child's attendance status.",
    "how do i send absent student notifications": "To send absent student notifications:\n1. Click on 'Absent Student Notifications'.\n2. Select the required 'Grade', 'Section', and 'Attendance code'.\n3. Click 'Show' button to view the student list based on the selected attendance code and date.\n4. Choose whether to send email, SMS, or app alerts to parents by selecting the required tick mark options.\n5. The system shows the count of Email/SMS/Alert sent to avoid repeat alerts to parents.",
    "what is the 'fire register detail' report used for": "The 'Fire Register Detail' report is used to get an attendance report for the selected date specifically for present students. This report is crucial for fire drills or any emergency situations to quickly identify who is present in the school. Blue tick marks indicate students who are present.",
    "what are the different 'attendance view' options in reports": "The 'Attendance View' report has four main options:\n1.  **Date View:** Shows attendance data for a specific date.\n2.  **Week View:** Shows attendance data for a selected week.\n3.  **Month View:** Shows attendance data for a selected month.\n4.  **All:** Shows all attendance data between the 'From Date' and 'To Date' selected in the filters.",
    "what is the 'attendance not marked' report": "The 'Attendance Not Marked' report provides a list of classes where attendance has not been marked or has only been partially marked for a given date range. This helps ensure that all attendance records are complete.",
    "can i add remarks when marking attendance": "Yes, when marking daily or monthly attendance, you can right-click on any student block (for daily) or any cell against the student (for monthly) to open a pop-up window where you can add any remark, especially in case of absent or late attendance.",
    "what fields are available for filtering attendance": "The available fields for filtering attendance include 'Curriculum', 'Academic Year', 'Grade', 'Section', 'From Date', and 'To Date'. These allow you to narrow down the attendance data you wish to view or export.",
    "how do i mark attendance for all students as present at once": "Go to 'Mark Daily Attendance', select the curriculum, academic year, grade, section, and date. After the student list loads, click 'Mark All Present' to mark everyone present. Then submit the form to save the attendance.",
    "can i add a remark for a student who came late today": "Yes. In 'Mark Daily Attendance', right-click on the student block and a pop-up will open where you can enter a remark for late arrival.",
    "how do i manage attendance for an entire month": "Use 'Manage Monthly Attendance'.\n1. Select the 'Curriculum', 'Academic Year', 'Grade', 'Section', and 'Month'.\n2. Click 'Search' to populate the student list with the full month's attendance.\n3. You can right-click on any date column to 'Mark All Present' or 'Mark All Absent' for that day.\n4. To mark individual cells (a specific date for a specific student), select the required 'attendance code'.\n5. Right-click on any cell to add 'remarks'.\n6. Finally, click 'Submit' to save the attendance.",
    "where can i generate an attendance slip for a student leaving early": "Use the 'Student Attendance Slip Form' under Transactions.\n1. Select the student and update the 'time', select the required 'attendance code' (like Leave Early), select the 'slot', and add 'remark' if needed.\n2. Then click 'Issue' to generate the slip.",
    "is it possible to send sms alerts to parents of absent students": "Yes. Go to 'Absent Student Notifications'.\n1. Apply filters, and select the students.\n2. Choose to send alerts via 'SMS', 'email', or the 'parent app'.",
    "how do i create a new attendance code": "Navigate to 'Student Attendance Code' under Setup.\n1. Click 'New'.\n2. Fill required fields like 'Curriculum', 'Category Code', 'Attendance Code', and then click 'Save'.",
    "can i edit an existing attendance code without deleting it": "Yes. In 'Student Attendance Code'.\n1. Click the 'Edit' icon next to the code.\n2. Make the necessary changes in the popup and click 'Update'.",
    "where can i view the attendance summary for a specific week": "Use 'Attendance View' under Reports.\n1. Choose the 'Week View' option in the 'Attendance View' filter to see weekly data.",
    "what’s the difference between date view and month view in attendance reports": "'Date View' shows data for a specific day, while 'Month View' shows data for an entire month. Both are accessible from the 'Attendance View' screen under Reports.",
    "how do i check if attendance was not marked for a particular day": "Use 'Attendance Not Marked' under Reports.\n1. It shows classes where attendance was not fully or partially marked within a date range.",
    "how can i export attendance data to excel": "Go to 'Export Attendance Data'.\n1. Apply the filters.\n2. Click 'Preview' to view the data.\n3. Then click 'Export' to download the Excel file.",
    "can i print a fire drill report with all students who are present": "Yes. Use 'Fire Register Detail'.\n1. Select the 'date'.\n2. Click 'Print'.\n3. Students with a blue tick are marked present.",
    "how do i filter students by grade and section when marking attendance": "In 'Mark Daily Attendance' or 'Manage Monthly Attendance'.\n1. Select the desired 'Grade' and 'Section' in the filters before clicking 'Search'.",
    "what happens if i issue an attendance slip—does it change the attendance record too": "Yes. Issuing a slip from 'Student Attendance Slip Form' updates the student's 'attendance code' for that date.",
    "is there a way to reprint a previously issued attendance slip": "Yes. Use the 'Reissue' button in the 'Student Attendance Slip Form' to reprint a previously issued slip.",
    "can i select different attendance codes for different students in daily view": "Yes. In 'Mark Daily Attendance', you can assign different 'attendance codes' to each student individually before submitting.",
    "how do i bulk mark students as absent in monthly view": "In 'Manage Monthly Attendance'.\n1. Right-click on the 'date column'.\n2. Choose 'Mark All Absent'.\n3. You can then edit individual entries if needed.",
    "why do i see a blue tick next to some students on the Fire Register Detail page": "A blue tick indicates that the student is marked present for the selected date. It helps quickly identify who is present in the school during drills or emergencies.",
    "can i get a report of all attendance from the start of term until today": "Yes. Use 'Attendance View'.\n1. Choose 'All' in the View filter.\n2. Then set the 'date range' from the start of term until today.",
    "how do i know if an alert has already been sent to a parent": "In 'Absent Student Notifications', the system displays a count of 'emails', 'SMS', or 'app alerts' already sent to avoid duplicates.",
    "what roles can access and mark student attendance": "'Class Teachers', 'Subject Teachers', 'Admins', and other designated roles can access and mark student attendance based on assigned permissions.",
    "how do i quickly mark all students as present or absent for the day": "In the 'Mark Daily Attendance' section, use the 'Mark All Present' or 'Mark All Absent' button to set the status for all students at once before submitting.",
    "can i add remarks for students who are late or leave early": "Yes. Right-click on the student's 'attendance cell' or 'block' to open a pop-up where you can add 'remarks' for late arrival or early departure.",
    "how do i send notifications to parents for absent students": "Use the 'Absent Students Notifications' feature to send 'emails', 'SMS', or 'app alerts' to parents of absent students after selecting the appropriate filters.",
    "how can i export attendance data for a specific grade or section": "Apply the desired filters in the 'Export Attendance Data' section, preview the data, and click 'Export' to download the file.",
    "how do i print a list of students present during a fire drill": "Use the 'Fire Register Detail' report.\n1. Select the 'date'.\n2. Click 'Print' to generate a list of students marked present.",
    "can i reprint a previously issued attendance slip": "Yes. Use the 'Reissue' button in the 'Student Attendance Slip Form' to reprint an existing slip.",
    "what should I do if a student's attendance is marked incorrectly": "Edit the 'attendance entry' for the student in the relevant daily or monthly attendance section and resubmit the correct status."
};

// Function to find the best matching FAQ
function findBestMatch(query) {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let bestMatchKey = null;
    let maxMatches = 0;

    for (const key in faqs) {
        const faqWords = key.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        let currentMatches = 0;
        for (const qWord of queryWords) {
            if (faqWords.includes(qWord)) {
                currentMatches++;
            }
        }

        // Prioritize longer matches or higher percentage of matched words
        if (currentMatches > maxMatches) {
            maxMatches = currentMatches;
            bestMatchKey = key;
        } else if (currentMatches === maxMatches && currentMatches > 0) {
            // If same number of matches, prefer the one with fewer words in the FAQ key (more specific)
            if (faqWords.length < (bestMatchKey ? bestMatchKey.split(/\s+/).length : Infinity)) {
                bestMatchKey = key;
            }
        }
    }
    // A simple threshold for considering a match valid
    // At least 50% of the FAQ key's words must be in the query, or at least 2 words if the FAQ key is short
    if (bestMatchKey && (maxMatches >= bestMatchKey.split(/\s+/).length / 2 || maxMatches >= 2)) {
        return faqs[bestMatchKey];
    }
    return null;
}


// Function to handle sending messages
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage('user', message);
    userInput.value = ''; // Clear input field

    const lowerCaseMessage = message.toLowerCase();
    let botResponse = findBestMatch(lowerCaseMessage); // Try to find a fuzzy match first

    if (!botResponse) {
        // If no direct or fuzzy FAQ match, call the LLM with context
        addMessage('bot', '<span id="loading-indicator" class="animate-pulse">Typing...</span>');
        const loadingIndicator = document.getElementById('loading-indicator');

        try {
            // --- Gemini API Integration ---
            let chatHistory = [];
            // Provide the user guide content as context to the LLM
            chatHistory.push({ role: "user", parts: [{ text: `Based on the following user guide content, answer the question: "${message}"\n\nUser Guide Content:\n${userGuideContent}` }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will provide this API key automatically at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                botResponse = result.candidates[0].content.parts[0].text;
            } else {
                botResponse = "I'm sorry, I couldn't get a response. Please try again or rephrase your question.";
            }
            // --- End Gemini API Integration ---

        } catch (error) {
            console.error("Error calling Gemini LLM:", error);
            botResponse = "I'm having trouble connecting to the AI service right now. Please try again later.";
        } finally {
            // Remove loading indicator and display actual response
            if (loadingIndicator && loadingIndicator.parentNode) {
                 loadingIndicator.parentNode.remove();
            }
            addMessage('bot', botResponse);
        }
    } else {
        addMessage('bot', botResponse);
    }
}

// Event listener for the close button
closeButton.addEventListener('click', () => {
    // Send a message to the parent window to hide the iframe
    window.parent.postMessage('hide_chatbot', '*'); // '*' means any origin, for security, you might want to specify the parent's origin
});

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
