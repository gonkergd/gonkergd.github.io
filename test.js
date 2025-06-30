import readlineSync from 'readline-sync';
let bro = readlineSync.question('searchuser: ');
(async () => {
    const result = await searchUser(bro);
    console.log(result);
    const hello = await showUserSelection(result);
console.log(hello);
})();

async function searchUser(username) {
    try {
        const response = await fetch(`https://gdladder.com/api/user/search?name=${encodeURIComponent(username)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        // Only return [Name, ID] pairs
        return users.map(user => [user.Name, user.ID]);
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
}
function showUserSelection(users) {
    /* const userSelection = document.getElementById('userSelection');
    const userOptions = document.getElementById('userOptions'); */
    users.forEach(user => {
        const option = document.createElement('div');
        option.className = 'user-option';
        option.innerHTML = `<strong>${user[0]}</strong> (ID: ${user[1]})`;
        option.addEventListener('click', () => fetchUserSubmissions(user[0], user[1]));
        // Append the option to the user options container
        userOptions.appendChild(option); 
    });
    
    userSelection.style.display = 'block';
}