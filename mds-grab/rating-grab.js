const DIFFICULTY_MAPS = ['Demote', 'Easy', 'Medium', 'Hard', 'Insane', 'Extreme', 'Remorseless', 'Relentless'];

async function loadEnjoyment(userId, resultDiv, progressDiv, onLoaded) {
    resultDiv.textContent = "Loading...";
    if (progressDiv) progressDiv.textContent = "";
    try {
        const allSubs = await fetchAllSubmissions(userId, progressDiv);
        // console.log(allSubs);
        // Split into classics and platformers
        const classics = allSubs.filter(sub => sub.Level && sub.Level.Rating !== null);
        const platformers = allSubs.filter(sub => sub.Level && sub.Level.Rating === null);

        const categorized = {
            classics: categorize(classics),
            platformers: categorize(platformers)
        };

        // Sort each difficulty by rating (descending)
        for (const mode of ['classics', 'platformers']) {
            for (const diff of DIFFICULTY_MAPS) {
                if (categorized[mode][diff]) {
                    categorized[mode][diff].sort((a, b) => b.rating - a.rating);
                }
            }
        }

        // Convert to displayable lines
        for (const mode of ['classics', 'platformers']) {
            for (const diff of DIFFICULTY_MAPS) {
                if (categorized[mode][diff]) {
                    categorized[mode][diff] = categorized[mode][diff].map(obj =>
                        `${obj.name} by ${obj.creator} (${obj.rating})`
                    );
                }
            }
        }

        if (typeof onLoaded === "function") onLoaded(categorized);

    } catch (err) {
        resultDiv.textContent = "Failed to load rating data.";
        if (progressDiv) progressDiv.textContent = "";
        console.error(err);
    }
}

async function fetchAllSubmissions(userId, progressDiv) {
    const API_URL = `https://gdladder.com/api/user/${userId}/submissions?limit=25&page=`;
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
    const map = { Demote: [], Easy: [], Medium: [], Hard: [], Insane: [], Extreme: [], Remorseless: [], Relentless: []};
    for (const sub of subs) {
        const rating = sub.Rating;
        console.log(rating);
        if (rating == null || !sub.Level || !sub.Level.Meta) continue;
        const meta = sub.Level.Meta;
        const diff = meta.Difficulty;
        const name = meta.Name;
        const creator = meta.Creator || (meta.Publisher && meta.Publisher.name) || "Unknown";
        console.log(diff);
        if (diff == "Medium") {
            switch (rating) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    map["Demote"].push({ name, creator, rating: "Demote T" + rating });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 6:
                    map["Easy"].push({ name, creator, rating: "Easy" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 7:
                    map["Medium"].push({ name, creator, rating: "Medium" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 8:
                    map["Hard"].push({ name, creator, rating: "Hard" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 9:
                    map["Insane"].push({ name, creator, rating: "Insane" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 10:
                    map["Extreme"].push({ name, creator, rating: "Extreme" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
                    break;
                case 11:
                    map["Remorseless"].push({ name, creator, rating: "Remorseless" });
                    console.log("Pushed " + name + " " + " " + creator + " " + rating);
            }
            if (rating >= 12) {
                map["Relentless"].push({ name, creator, rating: "Relentless T" + rating });
                console.log("Pushed " + name + " " + " " + creator + " " + rating);
            }
        }
    }
    return map;
}