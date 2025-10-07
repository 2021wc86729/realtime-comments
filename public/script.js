
//1. Get reference to the HTML elements
const commentsContainer = document.getElementById('comments-container');
const commentForm = document.getElementById('comment-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');

//2. Create a WebSocket connection to our Server
//Use 'ws' for http and 'wss' for https
const socket = new WebSocket('ws://localhost:8080');
//Alistener for when the connection is established
socket.onopen=(event)=>{
    console.log('✅ WebSocket connection established.');
}

//3. Handle what happens when a message is received from the server
socket.onmessage = (event)=>{
    //The server sends us stringified JSON , so we need to parse it
    console.log('⬅️ Received message from server:', event.data);
    const comment = JSON.parse(event.data);
    addCommentToDOM(comment);
}


// 4. Handle form submission
commentForm.addEventListener('submit',(e)=>{
    //Prevent the default form submission which reloads the page
    e.preventDefault();
    console.log('Test')
    //Get the values from the input fields
    const name = nameInput.value;
    const message = messageInput.value;

    //simple validation
    if (!name || !message){
        return;
    }

    //create the comment object
    const commentData={
        name:name,
        message:message
    };
    
    //Send the comment object to the server as a JSON string
    console.log('➡️ Sending message to server:', commentData);
    socket.send(JSON.stringify(commentData));

    //Clear the message input field for the next comment
    messageInput.value='';

})


// Helper function to create and add the comment element to the page
function addCommentToDOM(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');

    commentElement.innerHTML = `
        <p class="name">${escapeHTML(comment.name)}</p>
        <p class="message">${escapeHTML(comment.message)}</p>
    `;

    commentsContainer.appendChild(commentElement);

    // Scroll to the bottom to see the latest comment
    commentsContainer.scrollTop = commentsContainer.scrollHeight;
}

// A simple function to prevent XSS attacks by escaping HTML characters
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
