const DIFFICULTY_MAPS = ['Easy', 'Medium', 'Hard', 'Insane', 'Extreme'];

async function loadEnjoyment(userId, resultDiv, progressDiv, onLoaded) {
    resultDiv.textContent = "Loading...";
    if (progressDiv) progressDiv.textContent = "";
    try {
        const allSubs = await fetchAllSubmissions(userId, progressDiv);
        // Split into classics and platformers
        const classics = allSubs.filter(sub => sub.Level && sub.Level.Rating !== null);
        const platformers = allSubs.filter(sub => sub.Level && sub.Level.Rating === null);

        const categorized = {
            classics: categorize(classics),
            platformers: categorize(platformers)
        };

        // Sort each difficulty by enjoyment (descending)
        for (const mode of ['classics', 'platformers']) {
            for (const diff of DIFFICULTY_MAPS) {
                if (categorized[mode][diff]) {
                    categorized[mode][diff].sort((a, b) => b.enjoyment - a.enjoyment);
                }
            }
        }

        // Convert to displayable lines
        for (const mode of ['classics', 'platformers']) {
            for (const diff of DIFFICULTY_MAPS) {
                if (categorized[mode][diff]) {
                    categorized[mode][diff] = categorized[mode][diff].map(obj =>
                        `${obj.name} by ${obj.creator} (${obj.enjoyment})`
                    );
                }
            }
        }

        if (typeof onLoaded === "function") onLoaded(categorized);

    } catch (err) {
        resultDiv.textContent = "Failed to load enjoyment data.";
        if (progressDiv) progressDiv.textContent = "";
        console.error(err);
    }
}

async function fetchAllSubmissions(userId, progressDiv) {
    const API_URL = `https://corsproxy.io/?https://gdladder.com/api/user/${userId}/submissions?limit=25&page=`;
    // Fetch first page to get total count
    const firstPage = await fetch(API_URL + '0').then(res => res.json());
    const { total, limit } = firstPage;
    const totalPages = Math.ceil(total / limit);

    let allSubs = firstPage.submissions || [];
    if (progressDiv) progressDiv.textContent = `1/${totalPages}`;

    // Fetch remaining pages if any, with delay for rate limit
    for (let page = 2; page <= totalPages; page++) {
        await new Promise(resolve => setTimeout(resolve, 650)); // 650ms delay between requests
        const pageData = await fetch(API_URL + page).then(res => res.json());
        allSubs = allSubs.concat(pageData.submissions || []);
        if (progressDiv) progressDiv.textContent = `${page}/${totalPages}`;
    }
    if (progressDiv) progressDiv.textContent = "";
    return allSubs;
}

function categorize(subs) {
    const map = { Easy: [], Medium: [], Hard: [], Insane: [], Extreme: [] };
    for (const sub of subs) {
        const enjoyment = sub.Enjoyment;
        if (enjoyment == null || !sub.Level || !sub.Level.Meta) continue;
        const meta = sub.Level.Meta;
        const diff = meta.Difficulty;
        const name = meta.Name;
        const creator = meta.Creator || (meta.Publisher && meta.Publisher.name) || "Unknown";
        if (map[diff]) {
            map[diff].push({ name, creator, enjoyment });
        }
    }
    return map;
}