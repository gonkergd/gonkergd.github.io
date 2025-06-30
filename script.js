
// Functions for interacting with GDLadder API and processing data
async function searchUser(username) {
    try {
        const corsProxy = "https://corsproxy.io/?";
        const url = corsProxy + encodeURIComponent(`https://gdladder.com/api/user/search?name=${encodeURIComponent(username)}`);
        const response = await fetch(url);
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
let currentSubmissions = [];
let selectedUserId = null;
let isFetchingSubmissions = false; 
let hasGeneratedRankings = false;
async function fetchAllSubmissions(userId) {
    const limit = 25;
    let allSubmissions = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
        try {
            const corsProxy = "https://corsproxy.io/?";
            const url = corsProxy + encodeURIComponent(`https://gdladder.com/api/user/${userId}/submissions?page=${page}&limit=${limit}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allSubmissions = allSubmissions.concat(data.submissions);
            totalPages = Math.ceil(data.total / limit);
            page++;
            updateProgress(page, totalPages);
            if (page < totalPages) {
                await new Promise(resolve => setTimeout(resolve, 600)); // Rate limit: ~100 requests/min
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            throw error;
        }
    }
    return allSubmissions;
}

function calculateDifference(userValue, avgValue, stdDev, useSd) {
    if (useSd) {
        const lowerBound = avgValue - stdDev;
        const upperBound = avgValue + stdDev;
        if (userValue >= lowerBound && userValue <= upperBound) {
            return 0.0;
        }
        return userValue < avgValue ? Math.abs(userValue - lowerBound) : Math.abs(userValue - upperBound);
    }
    return Math.abs(userValue - avgValue);
}

function rankSubmissions(submissions, config) {
    const ranked = [];
    const metricName = config.metric === 'r' ? 'Rating' : 'Enjoyment';

    submissions.forEach(sub => {
        const levelData = sub.Level;
        const userValue = sub[metricName];
        const avgValue = levelData[metricName];
        const stdDev = levelData.Deviation || 0;

        const diff = calculateDifference(userValue, avgValue, stdDev, config.use_sd);

        if (!config.remove_zero_outliers || diff > config.exclude_count) {
            ranked.push({
                level_name: levelData.Meta.Name,
                creator: levelData.Meta.Creator,
                user_value: userValue,
                avg_value: avgValue,
                std_dev: stdDev,
                diff: diff
            });
        }
    });

    ranked.sort((a, b) => b.diff - a.diff);
    return ranked;
}

function showUserSelection(users) {
    const userSelection = document.getElementById('userSelection');
    const userOptions = document.getElementById('userOptions'); 
    userOptions.innerHTML = ''; // <-- Add this line to clear previous results
    users.forEach(user => {
        const option = document.createElement('div');
        option.className = 'user-option';
        option.innerHTML = `<strong>${user[0]}</strong> (ID: ${user[1]})`;
        option.addEventListener('click', () => fetchUserSubmissions(user[1], user[0]));
        // Append the option to the user options container
        userOptions.appendChild(option); 
    });
    
    userSelection.style.display = 'block';
}



async function fetchUserSubmissions(userId, displayName) {
    if (isFetchingSubmissions) {
        showError('Already fetching submissions for another user. Please wait.');
        return;
    }
    isFetchingSubmissions = true; // Set flag

    document.getElementById('progressCard').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('userSelection').style.display = 'none';

    try {
        const submissions = await fetchAllSubmissions(userId);
        currentSubmissions = submissions;
        selectedUserId = userId;
        hasGeneratedRankings = true;
        setTimeout(() => {
            document.getElementById('progressCard').style.display = 'none';
            showSuccess(`Found ${submissions.length} submissions for ${displayName}`);
            
            document.getElementById('rankBtn').disabled = false;
        }, 500);
    } catch (error) {
        document.getElementById('progressCard').style.display = 'none';
        showError('Failed to fetch submissions: ' + error.message);
    } finally {
        console.log("meow")    }
}
async function fetchUserSubmissions(userId, displayName) {
    if (isFetchingSubmissions) {
        showError('Please reload to fetch submissions for another user.');
        return;
    }
    isFetchingSubmissions = true; // Set flag

    document.getElementById('progressCard').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('userSelection').style.display = 'none';

    try {
        const submissions = await fetchAllSubmissions(userId);
        currentSubmissions = submissions;
        selectedUserId = userId;

        setTimeout(() => {
            document.getElementById('progressCard').style.display = 'none';
            showSuccess(`Found ${submissions.length} submissions for ${displayName}`);
            document.getElementById('rankBtn').disabled = false;
        }, 500);
    } catch (error) {
        document.getElementById('progressCard').style.display = 'none';
        showError('Failed to fetch submissions: ' + error.message);
    } finally {
        console.log("mrrp"); // Reset flag
    }
}



function getConfig() {
    const useDefaults = document.getElementById('useDefaults').checked;
    
    if (useDefaults) {
        return {
            remove_zero_outliers: true,
            exclude_count: 0.5,
            include_diff: true,
            include_user_value: true,
            include_std_dev: false,
            include_avg_value: true,
            use_compact_format: true,
            metric: 'r',
            use_sd: false
        };
    }

    return {
        remove_zero_outliers: document.getElementById('removeOutliers').checked,
        exclude_count: parseFloat(document.getElementById('excludeCount').value),
        include_diff: document.getElementById('includeDiff').checked,
        include_user_value: document.getElementById('includeUserValue').checked,
        include_std_dev: document.getElementById('includeStdDev').checked,
        include_avg_value: document.getElementById('includeAvgValue').checked,
        use_compact_format: true,
        metric: document.getElementById('metric').value,
        use_sd: document.getElementById('comparison').value === 'sd'
    };
}

function displayResults(rankedSubmissions, config) {
    const rankingList = document.getElementById('rankingList');
    const metricName = config.metric === 'r' ? 'rating' : 'enjoyment';

    rankingList.innerHTML = '';

    // Filter out submissions where user_value is null
    rankedSubmissions
        .filter(sub => sub != null && sub.user_value != null)
        .forEach((sub, index) => {
            const item = document.createElement('div');
            item.className = 'ranking-item';

            const metrics = [];
            if (config.include_diff && sub.diff != null) metrics.push(`${sub.diff.toFixed(2)} AI-Ness`);
            if (config.include_user_value && sub.user_value != null) metrics.push(`${sub.user_value} your ${metricName}`);
            if (config.include_avg_value && sub.avg_value != null) metrics.push(`${sub.avg_value.toFixed(2)} level ${metricName}`);
            if (config.include_std_dev && sub.std_dev != null) metrics.push(`${sub.std_dev.toFixed(2)} SD`);

            item.innerHTML = `
                <div class="ranking-number">#${index + 1}</div>
                <div class="level-name">${sub.level_name}</div>
                <div class="creator">by ${sub.creator}</div>
                <div class="metrics">${metrics.join(' • ')}</div>
            `;

            rankingList.appendChild(item);
        });

    document.getElementById('results').style.display = 'block';
}

function showError(message) {
    removeMessages();
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    document.querySelector('.container').insertBefore(error, document.querySelector('.card'));
    setTimeout(removeMessages, 10000);
}

function showSuccess(message) {
    removeMessages();
    const success = document.createElement('div');
    success.className = 'success';
    success.textContent = message;
    document.querySelector('.container').insertBefore(success, document.querySelector('.card'));
    setTimeout(removeMessages, 5000);
}

function updateProgress(current, total) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = total > 0 ? (current / total) * 100 : 0;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `Fetching submissions... ${current}/${total} pages`;
}

function removeMessages() {
    document.querySelectorAll('.error, .success').forEach(el => el.remove());
}
// Border: Functions above handle API interaction and data processing; functions below manage UI and button interactions


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('useDefaults').addEventListener('change', function() {
        const customConfig = document.getElementById('customConfig');
        customConfig.style.display = this.checked ? 'none' : 'block';
    });

    document.getElementById('searchBtn').addEventListener('click', async function() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showError('Please enter a username');
        return;
    }
    if (hasGeneratedRankings) {
        showError('Rankings have already been generated. Please refresh the page to analyze another user.');
        return;
    }
    this.disabled = true;
    this.textContent = 'Searching...';
    try {
        const waitResult = await searchUser(username);
        console.log(waitResult);
        if (waitResult.length === 0) {
            showError('No users found');
        } else {
            showUserSelection(waitResult);
        }
    } catch (error) {
        showError('Error occurred during search: ' + error.message);
    } finally {
        this.disabled = false;
        this.textContent = 'Search User';
    }
});

    document.getElementById('rankBtn').addEventListener('click', function() {
        if (!currentSubmissions.length) {
            showError('No submissions to rank');
            return;
        }

        const config = getConfig();
        this.disabled = true;
        this.textContent = 'Generating Rankings...';

        try {
            const rankedSubmissions = rankSubmissions(currentSubmissions, config);
            displayResults(rankedSubmissions, config);
        } catch (error) {
            showError('Error ranking submissions: ' + error.message);
        } finally {
            this.disabled = false;
            this.textContent = 'Generate Rankings';
        }
    });

    document.getElementById('downloadBtn').addEventListener('click', function() {
        if (document.getElementById('results').style.display === 'none') {
            showError('Generate rankings first to download');
            return;
        }

        const rankingItems = document.querySelectorAll('.ranking-item');
        let content = 'GD Ladder AI-Ness Rankings\n\n';
        
        rankingItems.forEach(item => {
            const number = item.querySelector('.ranking-number').textContent;
            const levelName = item.querySelector('.level-name').textContent;
            const creator = item.querySelector('.creator').textContent;
            const metrics = item.querySelector('.metrics').textContent;
            content += `${number} ${levelName} ${creator} - ${metrics}\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gd-ladder-rankings.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});

